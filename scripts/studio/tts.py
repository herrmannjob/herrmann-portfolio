"""
Step 2 of the studio pipeline: AI narration + original music bed.

Reads .studio/script.json (npm run studio:script), synthesizes every sentence
with Kokoro-82M (Apache-2.0, runs locally — no API keys), caches each
sentence, and writes for every locale × length:

  public/studio/<locale>/<length>.mp3     narration
  public/studio/manifest.json             sentence/scene timings + content hash

It also composes an original ambient music bed (pure numpy synthesis, so
there is nothing to license) used under the narration in the video:

  public/studio/bed.mp3

Setup (once):  python -m pip install -r scripts/studio/requirements.txt
Run:           npm run studio:audio
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import lameenc
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / ".studio" / "script.json"
CACHE = ROOT / ".studio" / "cache"
OUT = ROOT / "public" / "studio"

SR = 24_000  # Kokoro output rate
MUSIC_SR = 44_100

# Kokoro language codes and the (male, first-person) presenter voice per locale.
VOICES = {
    "en": {"lang": "a", "voice": "am_michael", "speed": 1.0},
    "pt": {"lang": "p", "voice": "pm_alex", "speed": 1.0},
    "es": {"lang": "e", "voice": "em_alex", "speed": 1.0},
    "zh": {"lang": "z", "voice": "zm_yunjian", "speed": 1.0},
}

PAUSE_SENTENCE = 0.32
PAUSE_SCENE = 0.75
LEAD_IN = 0.35
TAIL = 0.6


# --------------------------------------------------------------------------- #
# Text normalization: say things the way a person would                        #
# --------------------------------------------------------------------------- #

MORE_THAN = {"en": "more than {n}", "pt": "mais de {n}", "es": "más de {n}", "zh": "{n}多"}
MINUS = {"en": "minus {n}", "pt": "menos {n}", "es": "menos {n}", "zh": "减少{n}"}
MILLION = {"en": "over a million", "pt": "mais de um milhão", "es": "más de un millón", "zh": "超过一百万"}
ARROW = {"en": " to ", "pt": " para ", "es": " a ", "zh": "到"}
AT = {"en": " at ", "pt": " arroba ", "es": " arroba ", "zh": " at "}
DOT = {"en": " dot ", "pt": " ponto ", "es": " punto ", "zh": " dot "}
SPELL = {
    # Acronyms Kokoro/espeak would otherwise read as words.
    "LLMs": {"en": "L L Ms", "pt": "L L Ms", "es": "L L Ms", "zh": "大语言模型"},
    "RAG": {"en": "rag", "pt": "rag", "es": "rag", "zh": "RAG"},
    "C#/.NET": {"en": "C sharp and dot net", "pt": "C sharp e dot net", "es": "C sharp y dot net", "zh": "C# 和 .NET"},
    "C#": {"en": "C sharp", "pt": "C sharp", "es": "C sharp", "zh": "C sharp"},
    ".NET": {"en": "dot net", "pt": "dot net", "es": "dot net", "zh": "dot net"},
    "UX": {"en": "U X", "pt": "U X", "es": "U X", "zh": "UX"},
    "PJ": {"en": "P J", "pt": "P J", "es": "P J", "zh": "PJ"},
    "SaaS": {"en": "sass", "pt": "sass", "es": "sass", "zh": "SaaS"},
    "CI/CD": {"en": "C I C D", "pt": "C I C D", "es": "C I C D", "zh": "CI/CD"},
}


def speakable(text: str, locale: str) -> str:
    t = text
    t = re.sub(r"[\w.+-]+@[\w-]+(\.[\w-]+)+", lambda m: m.group(0).replace("@", AT[locale]).replace(".", DOT[locale]), t)
    t = t.replace("1M+", MILLION[locale])
    t = re.sub(r"(\d+)\+", lambda m: MORE_THAN[locale].format(n=m.group(1)), t)
    t = re.sub(r"[−–-](\d+%)", lambda m: MINUS[locale].format(n=m.group(1)), t)
    t = t.replace("→", ARROW[locale])
    for k, v in SPELL.items():
        t = re.sub(rf"(?<![\w.]){re.escape(k)}(?!\w)", v[locale], t)
    t = re.sub(r"\s*[—–·|]\s*", ", " if locale != "zh" else "，", t)
    t = t.replace("“", "").replace("”", "").replace('"', "")
    return re.sub(r"\s+", " ", t).strip()


# --------------------------------------------------------------------------- #
# Kokoro                                                                       #
# --------------------------------------------------------------------------- #

_pipelines: dict = {}


def pipeline(locale: str):
    from kokoro import KPipeline

    if locale not in _pipelines:
        _pipelines[locale] = KPipeline(lang_code=VOICES[locale]["lang"], repo_id="hexgrad/Kokoro-82M")
    return _pipelines[locale]


def synth(text: str, locale: str) -> np.ndarray:
    cfg = VOICES[locale]
    spoken = speakable(text, locale)
    key = hashlib.sha1(f"v2|{locale}|{cfg['voice']}|{cfg['speed']}|{spoken}".encode()).hexdigest()
    f = CACHE / locale / f"{key}.npy"
    if f.exists():
        return np.load(f)
    parts = [
        np.asarray(audio, dtype=np.float32)
        for _, _, audio in pipeline(locale)(spoken, voice=cfg["voice"], speed=cfg["speed"], split_pattern=None)
        if audio is not None
    ]
    wav = np.concatenate(parts) if parts else np.zeros(int(SR * 0.2), np.float32)
    wav = trim(wav)
    f.parent.mkdir(parents=True, exist_ok=True)
    np.save(f, wav)
    return wav


def trim(wav: np.ndarray, thr: float = 0.006) -> np.ndarray:
    idx = np.where(np.abs(wav) > thr)[0]
    if not len(idx):
        return wav
    a = max(0, idx[0] - int(SR * 0.03))
    b = min(len(wav), idx[-1] + int(SR * 0.08))
    return wav[a:b]


def loudness_normalize(x: np.ndarray, target_rms_db: float = -19.0, peak_db: float = -1.0) -> np.ndarray:
    voiced = x[np.abs(x) > 0.01]
    rms = np.sqrt(np.mean(voiced**2)) if len(voiced) else 1e-6
    y = x * (10 ** (target_rms_db / 20) / max(rms, 1e-6))
    # soft-knee limiter so peaks never clip
    lim = 10 ** (peak_db / 20)
    return np.tanh(y / lim) * lim


def mp3(x: np.ndarray, sr: int, path: Path, kbps: int = 96, channels: int = 1) -> None:
    enc = lameenc.Encoder()
    enc.set_bit_rate(kbps)
    enc.set_in_sample_rate(sr)
    enc.set_channels(channels)
    enc.set_quality(2)
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    if channels == 2:
        pcm = pcm.reshape(-1)  # interleaved L R L R
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(enc.encode(pcm.tobytes()) + enc.flush())


# --------------------------------------------------------------------------- #
# Original ambient bed: Am7 – Fmaj7 – Cmaj7 – G6, 92 BPM                        #
# --------------------------------------------------------------------------- #


def midi_hz(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def soft_saw(freq: float, t: np.ndarray, detune_cents=(-7, 0, 7)) -> np.ndarray:
    out = np.zeros_like(t)
    for c in detune_cents:
        f = freq * 2 ** (c / 1200)
        for h in range(1, 9):  # band-limited, darkened harmonics = warm pad
            out += np.sin(2 * np.pi * f * h * t + h * 0.7) * (1 / h) * np.exp(-h / 3.2)
    return out / len(detune_cents)


def reverb(x: np.ndarray, sr: int, seconds: float = 2.2, mix: float = 0.35, seed: int = 7) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(sr * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir[:200] *= np.linspace(0, 1, 200)
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    wet /= np.max(np.abs(wet)) + 1e-9
    dry = x / (np.max(np.abs(x)) + 1e-9)
    return (1 - mix) * dry + mix * wet


def compose_bed(seconds: float) -> np.ndarray:
    sr = MUSIC_SR
    bpm = 92
    beat = 60 / bpm
    bar = 4 * beat
    chords = [  # (root for bass, voicing)
        (45, [57, 60, 64, 67]),  # Am7
        (41, [53, 57, 60, 64]),  # Fmaj7
        (48, [55, 59, 60, 64]),  # Cmaj7
        (43, [55, 59, 62, 64]),  # G6
    ]
    seg = 2 * bar  # two bars per chord
    n = int(seconds * sr)
    pad = np.zeros(n)
    bass = np.zeros(n)
    arpL = np.zeros(n)
    arpR = np.zeros(n)
    pulse = np.zeros(n)

    t_seg = np.arange(int((seg + 2.0) * sr)) / sr  # +2s release tail
    env_pad = np.minimum(1, t_seg / 1.4) * np.clip((seg + 1.6 - t_seg) / 1.6, 0, 1)
    k = 0
    start = 0.0
    while start < seconds:
        root, notes = chords[k % len(chords)]
        a = int(start * sr)
        b = min(n, a + len(t_seg))
        span = b - a
        chord = sum(soft_saw(midi_hz(m), t_seg) for m in notes) / len(notes)
        pad[a:b] += (chord * env_pad)[:span]
        sub = np.sin(2 * np.pi * midi_hz(root - 12) * t_seg) * env_pad
        bass[a:b] += sub[:span]
        # 8th-note arpeggio, ping-pong, two octaves up, only on the 2nd half of the loop for movement
        steps = int(seg / (beat / 2))
        order = notes + notes[::-1][1:-1]
        for s in range(steps):
            ts = start + s * beat / 2
            i = int(ts * sr)
            if i >= n:
                break
            dur = int(0.9 * sr)
            tt = np.arange(min(dur, n - i)) / sr
            f = midi_hz(order[s % len(order)] + 12)
            note = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt / 0.28)
            note *= 0.55 if s % 4 else 0.8
            (arpL if s % 2 else arpR)[i : i + len(tt)] += note
        # soft pulse on beats 1 and 3
        for s in range(0, int(seg / beat), 2):
            i = int((start + s * beat) * sr)
            if i >= n:
                break
            tt = np.arange(min(int(0.35 * sr), n - i)) / sr
            pulse[i : i + len(tt)] += np.sin(2 * np.pi * (55 * np.exp(-tt * 9) + 38) * tt) * np.exp(-tt / 0.09)
        start += seg
        k += 1

    # simple 3/16-note echo on the arpeggio
    d = int(beat * 0.75 * sr)
    for src, dst in ((arpL, arpR), (arpR, arpL)):
        echo = np.zeros(n)
        echo[d:] = src[:-d] * 0.38
        dst += echo

    pad = reverb(pad, sr, 2.8, 0.45)
    arpL, arpR = reverb(arpL, sr, 2.0, 0.4, 3), reverb(arpR, sr, 2.0, 0.4, 5)
    L = 0.55 * pad + 0.35 * bass / (np.max(np.abs(bass)) + 1e-9) + 0.22 * arpL + 0.18 * pulse / (np.max(np.abs(pulse)) + 1e-9)
    R = 0.55 * pad + 0.35 * bass / (np.max(np.abs(bass)) + 1e-9) + 0.22 * arpR + 0.18 * pulse / (np.max(np.abs(pulse)) + 1e-9)
    st = np.stack([L, R], axis=1)
    fade_in = np.minimum(1, np.arange(n) / (1.5 * sr))
    fade_out = np.clip((n - np.arange(n)) / (3.5 * sr), 0, 1)
    st *= (fade_in * fade_out)[:, None]
    st /= np.max(np.abs(st)) + 1e-9
    return st * 10 ** (-3 / 20)


# --------------------------------------------------------------------------- #


def main() -> None:
    if not SCRIPT.exists():
        sys.exit("Run `npm run studio:script` first.")
    script = json.loads(SCRIPT.read_text(encoding="utf-8"))
    only = set(sys.argv[1:])  # optional: limit to locales, e.g. `pt en`
    manifest: dict = {"version": 1, "engine": "Kokoro-82M", "voices": {k: v["voice"] for k, v in VOICES.items()}, "tracks": {}}
    old = OUT / "manifest.json"
    if only and old.exists():
        manifest["tracks"] = json.loads(old.read_text(encoding="utf-8")).get("tracks", {})

    longest = 0.0
    for track in script["tracks"]:
        loc, length = track["locale"], track["length"]
        if only and loc not in only:
            continue
        pieces: list[np.ndarray] = [np.zeros(int(SR * LEAD_IN), np.float32)]
        t = LEAD_IN
        sentences, scenes = [], []
        for si, scene in enumerate(track["scenes"]):
            s_start = t
            for j, text in enumerate(scene["sentences"]):
                wav = synth(text, loc)
                sentences.append({"scene": si, "text": text, "start": round(t, 3), "end": round(t + len(wav) / SR, 3)})
                pieces.append(wav)
                t += len(wav) / SR
                gap = PAUSE_SENTENCE if j < len(scene["sentences"]) - 1 else PAUSE_SCENE
                pieces.append(np.zeros(int(SR * gap), np.float32))
                t += gap
            scenes.append({"kind": scene["kind"], "start": round(s_start, 3), "end": round(t, 3)})
        pieces.append(np.zeros(int(SR * TAIL), np.float32))
        audio = loudness_normalize(np.concatenate(pieces))
        duration = len(audio) / SR
        rel = f"{loc}/{length}.mp3"
        mp3(audio, SR, OUT / rel)
        manifest["tracks"].setdefault(loc, {})[length] = {
            "hash": track["hash"],
            "src": f"/studio/{rel}",
            "duration": round(duration, 3),
            "scenes": scenes,
            "sentences": sentences,
        }
        if length == "medium":
            longest = max(longest, duration)
        print(f"{loc}/{length}: {duration:5.1f}s, {len(sentences)} sentences", flush=True)

    if not only or not (OUT / "bed.mp3").exists():
        bed_len = max(longest, 60) + 8
        mp3(compose_bed(bed_len), MUSIC_SR, OUT / "bed.mp3", kbps=160, channels=2)
        print(f"bed.mp3: {bed_len:.0f}s")

    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("manifest.json written")


if __name__ == "__main__":
    main()
