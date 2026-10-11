"""
Step 2 of the studio pipeline: AI voices + original music.

Reads .studio/script.json (npm run studio:script) and writes to public/studio:

  <locale>/{short,medium,full}.mp3       summary narration (first person)
  <locale>/commercial-voice.mp3         commercial narration, placed on the beat grid
  <locale>/commercial-music.mp3         commercial score composed around that timeline
  manifest.json                         timings for read-along, captions and the video

Voices: Kokoro-82M by default (Apache-2.0, local, no keys). For studio-grade
voices set STUDIO_TTS=elevenlabs and ELEVENLABS_API_KEY in your shell (optionally
ELEVENLABS_VOICE_ID); keys are only read from the environment, never written.

The music is synthesized from scratch with numpy (nothing to license).

Setup (once):  python -m pip install -r scripts/studio/requirements.txt
Run:           npm run studio:audio            (all)
               npm run studio:audio -- pt en   (some locales)
"""

from __future__ import annotations

import hashlib
import json
import math
import os
import re
import sys
import urllib.request
from pathlib import Path

import lameenc
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / ".studio" / "script.json"
CACHE = ROOT / ".studio" / "cache"
OUT = ROOT / "public" / "studio"

SR = 24_000  # voice sample rate
MSR = 44_100  # music sample rate

PROVIDER = os.environ.get("STUDIO_TTS", "kokoro").lower()

# Summary: first person ("I'm Herrmann") → male presenter voices.
SUMMARY_VOICES = {
    "en": {"lang": "a", "voice": "am_michael", "speed": 1.0},
    "pt": {"lang": "p", "voice": "pm_alex", "speed": 1.0},
    "es": {"lang": "e", "voice": "em_alex", "speed": 1.0},
    "zh": {"lang": "z", "voice": "zm_yunjian", "speed": 1.0},
}
# Commercial: third-person narrator → each language's highest-rated Kokoro voice.
COMMERCIAL_VOICES = {
    "en": {"lang": "a", "voice": "af_heart", "speed": 0.94},
    "pt": {"lang": "p", "voice": "pf_dora", "speed": 0.95},
    "es": {"lang": "e", "voice": "ef_dora", "speed": 0.95},
    "zh": {"lang": "z", "voice": "zf_xiaoxiao", "speed": 0.95},
}

PAUSE_SENTENCE = 0.32
PAUSE_SCENE = 0.75

# Commercial grid
BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
INTRO_BARS = 1
VOICE_OFFSET = BEAT * 0.5


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
    # Acronyms the engines would otherwise read as words.
    "LLMs": {"en": "L L Ms", "pt": "L L Ms", "es": "L L Ms", "zh": "大语言模型"},
    "RAG": {"en": "rag", "pt": "rag", "es": "rag", "zh": "RAG"},
    "C#/.NET": {"en": "C sharp and dot net", "pt": "C sharp e dot net", "es": "C sharp y dot net", "zh": "C# 和 .NET"},
    "C#": {"en": "C sharp", "pt": "C sharp", "es": "C sharp", "zh": "C sharp"},
    ".NET": {"en": "dot net", "pt": "dot net", "es": "dot net", "zh": "dot net"},
    "UX": {"en": "U X", "pt": "U X", "es": "U X", "zh": "UX"},
    "PJ": {"en": "P J", "pt": "P J", "es": "P J", "zh": "PJ"},
    "SaaS": {"en": "sass", "pt": "sass", "es": "sass", "zh": "SaaS"},
    "CI/CD": {"en": "C I C D", "pt": "C I C D", "es": "C I C D", "zh": "CI/CD"},
    "AI": {"en": "A I", "pt": "A I", "es": "A I", "zh": "AI"},
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


def split_sentences(text: str) -> list[str]:
    parts = re.findall(r"[^.!?。！？\n]+[.!?。！？]*[\"”»]?", text)
    return [p.strip() for p in parts if p.strip()] or [text]


# --------------------------------------------------------------------------- #
# Voices                                                                       #
# --------------------------------------------------------------------------- #

_pipelines: dict = {}


def kokoro(text: str, cfg: dict) -> np.ndarray:
    from kokoro import KPipeline

    if cfg["lang"] not in _pipelines:
        _pipelines[cfg["lang"]] = KPipeline(lang_code=cfg["lang"], repo_id="hexgrad/Kokoro-82M")
    parts = [
        np.asarray(a, dtype=np.float32)
        for _, _, a in _pipelines[cfg["lang"]](text, voice=cfg["voice"], speed=cfg["speed"], split_pattern=None)
        if a is not None
    ]
    return np.concatenate(parts) if parts else np.zeros(int(SR * 0.2), np.float32)


def elevenlabs(text: str) -> np.ndarray:
    key = os.environ["ELEVENLABS_API_KEY"]
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")
    body = json.dumps(
        {
            "text": text,
            "model_id": os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2"),
            "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
        }
    ).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=pcm_24000",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        return np.frombuffer(r.read(), dtype="<i2").astype(np.float32) / 32768


def synth(text: str, locale: str, cfg: dict) -> np.ndarray:
    spoken = speakable(text, locale)
    if PROVIDER == "elevenlabs":
        ident = f"v3|{locale}|elevenlabs:{os.environ.get('ELEVENLABS_VOICE_ID', 'default')}|{spoken}"
    else:
        ident = f"v2|{locale}|{cfg['voice']}|{cfg['speed']}|{spoken}"
    key = hashlib.sha1(ident.encode()).hexdigest()
    f = CACHE / locale / f"{key}.npy"
    if f.exists():
        return np.load(f)
    wav = trim(elevenlabs(spoken) if PROVIDER == "elevenlabs" else kokoro(spoken, cfg))
    f.parent.mkdir(parents=True, exist_ok=True)
    np.save(f, wav)
    return wav


def trim(wav: np.ndarray, thr: float = 0.006) -> np.ndarray:
    idx = np.where(np.abs(wav) > thr)[0]
    if not len(idx):
        return wav
    return wav[max(0, idx[0] - int(SR * 0.03)) : min(len(wav), idx[-1] + int(SR * 0.08))]


def voice_master(x: np.ndarray, target_rms_db: float = -18.0, peak_db: float = -1.0) -> np.ndarray:
    """Gentle broadcast chain: normalize, light compression, soft limit."""
    voiced = x[np.abs(x) > 0.01]
    rms = np.sqrt(np.mean(voiced**2)) if len(voiced) else 1e-6
    y = x * (10 ** (target_rms_db / 20) / max(rms, 1e-6))
    # 2:1 compression above -24 dBFS, sample-wise on a smoothed envelope
    env = np.sqrt(np.convolve(y**2, np.ones(240) / 240, mode="same")) + 1e-9
    thr = 10 ** (-24 / 20)
    gain = np.where(env > thr, (thr * (env / thr) ** 0.5) / env, 1.0)
    y = y * gain * 10 ** (3 / 20)  # makeup
    lim = 10 ** (peak_db / 20)
    return np.tanh(y / lim) * lim


def mp3(x: np.ndarray, sr: int, path: Path, kbps: int = 96) -> None:
    channels = 2 if x.ndim == 2 else 1
    enc = lameenc.Encoder()
    enc.set_bit_rate(kbps)
    enc.set_in_sample_rate(sr)
    enc.set_channels(channels)
    enc.set_quality(2)
    pcm = (np.clip(x, -1, 1) * 32767).astype("<i2")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(enc.encode(pcm.reshape(-1).tobytes()) + enc.flush())


# --------------------------------------------------------------------------- #
# Synth toolbox                                                                #
# --------------------------------------------------------------------------- #


def hz(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def warm_saw(f: float, t: np.ndarray, bright: float = 3.2, detune=(-8, 0, 8)) -> np.ndarray:
    out = np.zeros_like(t)
    for c in detune:
        ff = f * 2 ** (c / 1200)
        for h in range(1, 10):
            out += np.sin(2 * np.pi * ff * h * t + h * 0.9) / h * np.exp(-h / bright)
    return out / len(detune)


def fft_filter(x: np.ndarray, sr: int, lo: float = 0, hi: float = 1e9) -> np.ndarray:
    n = len(x)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / sr)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, n)


def reverb(x: np.ndarray, sr: int, seconds: float, mix: float, seed: int = 7) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(sr * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir[:300] *= np.linspace(0, 1, 300)
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    wet /= np.max(np.abs(wet)) + 1e-9
    dry = x / (np.max(np.abs(x)) + 1e-9)
    return (1 - mix) * dry + mix * wet


def norm(x: np.ndarray) -> np.ndarray:
    return x / (np.max(np.abs(x)) + 1e-9)


def place(dst: np.ndarray, src: np.ndarray, at_s: float, sr: int, gain: float = 1.0) -> None:
    i = int(at_s * sr)
    if i >= len(dst) or i < 0:
        return
    n = min(len(src), len(dst) - i)
    dst[i : i + n] += src[:n] * gain


def kick(sr: int) -> np.ndarray:
    t = np.arange(int(0.45 * sr)) / sr
    f = 46 + 110 * np.exp(-t * 28)
    body = np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 7.5)
    click = np.random.default_rng(1).standard_normal(len(t)) * np.exp(-t * 400) * 0.25
    return np.tanh((body + click) * 1.6)


def clap(sr: int) -> np.ndarray:
    rng = np.random.default_rng(2)
    t = np.arange(int(0.35 * sr)) / sr
    noise = fft_filter(rng.standard_normal(len(t)), sr, 900, 6000)
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += np.where(t >= d, np.exp(-(t - d) * 60), 0)
    env += np.exp(-t * 14) * 0.5
    return norm(noise * env)


def hat(sr: int, open_: bool = False) -> np.ndarray:
    rng = np.random.default_rng(3)
    t = np.arange(int((0.3 if open_ else 0.06) * sr)) / sr
    return norm(fft_filter(rng.standard_normal(len(t)), sr, 7000, 16000) * np.exp(-t * (12 if open_ else 75)))


def riser(sr: int, seconds: float) -> np.ndarray:
    rng = np.random.default_rng(4)
    n = int(seconds * sr)
    t = np.arange(n) / sr
    out = np.zeros(n)
    steps = 24
    seg = n // steps
    for k in range(steps):  # noise band climbing in steps (cheap swept filter)
        lo = 300 * (1.17 ** k)
        chunk = fft_filter(rng.standard_normal(seg + 400), sr, lo, lo * 3)[:seg]
        out[k * seg : k * seg + seg] = chunk
    tone = np.sin(2 * np.pi * np.cumsum(180 * 2 ** (t / seconds * 2.5)) / sr) * 0.35
    env = (t / seconds) ** 2.2
    return norm((norm(out) + tone) * env)


def impact(sr: int) -> np.ndarray:
    rng = np.random.default_rng(5)
    t = np.arange(int(2.6 * sr)) / sr
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 9)) / sr) * np.exp(-t * 1.6)
    crash = fft_filter(rng.standard_normal(len(t)), sr, 3000, 15000) * np.exp(-t * 2.2) * 0.35
    return norm(np.tanh((boom + crash) * 1.4))


def pluck(f: float, sr: int, dur: float = 0.7) -> np.ndarray:
    t = np.arange(int(dur * sr)) / sr
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * np.exp(-t / 0.22)


# --------------------------------------------------------------------------- #
# Commercial score — vi–IV–I–V in A minor, 100 BPM, built around the story     #
# --------------------------------------------------------------------------- #

CHORDS = [  # (bass root, voicing)
    (45, [57, 60, 64, 67, 71]),  # Am9-ish
    (41, [53, 57, 60, 64, 67]),  # Fmaj7(9)
    (48, [55, 60, 64, 67, 71]),  # Cmaj7
    (43, [55, 59, 62, 67, 69]),  # G6/9
]


def compose_commercial(total: float, beats: list[dict]) -> np.ndarray:
    sr = MSR
    n = int(total * sr)
    start_of = {b["id"]: b["bar"] for b in beats}
    end_bar = beats[-1]["endBar"]
    reveal = start_of["reveal"]

    def section(bar: int) -> str:
        if bar < start_of["scale"]:
            return "intro"
        if bar < start_of["range"]:
            return "build"
        if bar < start_of["people"]:
            return "full"
        if bar < reveal - 1:
            return "break"
        if bar == reveal - 1:
            return "riser"
        if bar < end_bar:
            return "drop"
        return "outro"

    pad = np.zeros(n)
    bass = np.zeros(n)
    arpL, arpR = np.zeros(n), np.zeros(n)
    drums = np.zeros(n)
    fx = np.zeros(n)
    side = np.ones(n)  # sidechain gain

    K, CL, HC, HO = kick(sr), clap(sr), hat(sr), hat(sr, True)
    duck_len = int(0.28 * sr)
    duck_shape = 1 - 0.55 * np.exp(-np.linspace(0, 5, duck_len))

    total_bars = int(math.ceil(total / BAR))
    for bar in range(total_bars):
        sec = section(bar)
        t0 = bar * BAR
        root, notes = CHORDS[(bar // 2) % 4]
        if bar % 2 == 0:  # chord changes every two bars
            seg = 2 * BAR + 1.8
            t = np.arange(int(seg * sr)) / sr
            env = np.minimum(1, t / (0.9 if sec != "intro" else 1.8)) * np.clip((seg - t) / 1.8, 0, 1)
            bright = {"intro": 2.4, "build": 3.0, "full": 3.8, "break": 2.6, "riser": 3.0, "drop": 4.4, "outro": 2.8}[sec]
            chord = sum(warm_saw(hz(m), t, bright) for m in notes) / len(notes)
            place(pad, chord * env, t0, sr, 1.0 if sec in ("full", "drop") else 0.8)

        for s in range(16):  # 16th grid
            ts = t0 + s * BEAT / 4
            on_beat = s % 4 == 0
            # kick
            if sec in ("build",) and s in (0, 8):
                place(drums, K, ts, sr, 0.9)
            if sec in ("full", "drop") and on_beat:
                place(drums, K, ts, sr, 1.0)
            if sec == "riser" and on_beat and s < 12:
                place(drums, K, ts, sr, 0.5 + s / 24)
            if (sec in ("full", "drop") and on_beat) or (sec == "build" and s in (0, 8)):
                i = int(ts * sr)
                m = min(duck_len, n - i)
                if m > 0:
                    side[i : i + m] = np.minimum(side[i : i + m], duck_shape[:m])
            # clap on 2 & 4
            if sec in ("full", "drop") and s in (4, 12):
                place(drums, CL, ts, sr, 0.55)
            if sec == "build" and bar >= start_of["apps"] and s in (4, 12):
                place(drums, CL, ts, sr, 0.4)
            # hats
            if sec in ("intro", "break") and s % 4 == 2:
                place(drums, HC, ts, sr, 0.12)
            if sec in ("build",) and s % 2 == 1:
                place(drums, HC, ts, sr, 0.16)
            if sec in ("full", "drop") and s % 2 == 1:
                place(drums, HO if s % 4 == 2 else HC, ts, sr, 0.2 if s % 4 == 2 else 0.14)
            if sec == "riser":
                place(drums, HC, ts, sr, 0.05 + 0.2 * s / 16)
            # bass: pulsing 8ths from the build on
            if sec in ("build", "full", "drop") and s % 2 == 0:
                tt = np.arange(int(BEAT / 2 * sr)) / sr
                f = hz(root - 12)
                note = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 3) * np.minimum(1, tt * 200)
                place(bass, note, ts, sr, 0.9 if sec != "build" else 0.7)
            # arpeggio: 8ths in intro/break, 16ths when full
            step = 2 if sec in ("intro", "break", "build", "riser") else 1
            if s % step == 0 and sec != "outro":
                order = notes + notes[::-1][1:-1]
                f = hz(order[(s // step) % len(order)] + 12)
                g = {"intro": 0.5, "build": 0.45, "full": 0.35, "break": 0.55, "riser": 0.4, "drop": 0.38}[sec]
                place(arpL if (s // step) % 2 else arpR, pluck(f, sr), ts, sr, g)

        if sec == "riser":
            place(fx, riser(sr, BAR), t0, sr, 0.8)
    # big moments
    place(fx, impact(sr), reveal * BAR, sr, 1.0)
    place(fx, impact(sr), end_bar * BAR, sr, 0.7)

    # echo on the arp
    d = int(BEAT * 0.75 * sr)
    for src, dst in ((arpL, arpR), (arpR, arpL)):
        e = np.zeros(n)
        e[d:] = src[:-d] * 0.32
        dst += e

    pad = reverb(norm(pad), sr, 3.0, 0.4) * side
    bass = norm(fft_filter(bass, sr, 30, 900)) * side
    arpL, arpR = reverb(norm(arpL), sr, 2.2, 0.35, 3), reverb(norm(arpR), sr, 2.2, 0.35, 5)
    drums = norm(drums)
    fx = reverb(norm(fx), sr, 2.5, 0.3, 9)

    L = 0.42 * pad + 0.4 * bass + 0.22 * arpL + 0.55 * drums + 0.45 * fx
    R = 0.42 * pad + 0.4 * bass + 0.22 * arpR + 0.55 * drums + 0.45 * fx
    st = np.stack([L, R], axis=1)
    fade_in = np.minimum(1, np.arange(n) / (0.8 * sr))
    fade_out = np.clip((n - np.arange(n)) / (2.5 * sr), 0, 1)
    st *= (fade_in * fade_out)[:, None]
    # master: soft clip to a modest level so the voice sits on top
    st = np.tanh(norm(st) * 1.3) * 10 ** (-6 / 20)
    return st


# --------------------------------------------------------------------------- #
# Builders                                                                     #
# --------------------------------------------------------------------------- #


def build_summary(track: dict, manifest: dict) -> None:
    loc, length = track["locale"], track["length"]
    cfg = SUMMARY_VOICES[loc]
    pieces: list[np.ndarray] = [np.zeros(int(SR * 0.35), np.float32)]
    t = 0.35
    sentences, scenes = [], []
    for si, scene in enumerate(track["scenes"]):
        s_start = t
        for j, text in enumerate(scene["sentences"]):
            wav = synth(text, loc, cfg)
            sentences.append({"scene": si, "text": text, "start": round(t, 3), "end": round(t + len(wav) / SR, 3)})
            pieces.append(wav)
            t += len(wav) / SR
            gap = PAUSE_SENTENCE if j < len(scene["sentences"]) - 1 else PAUSE_SCENE
            pieces.append(np.zeros(int(SR * gap), np.float32))
            t += gap
        scenes.append({"kind": scene["kind"], "start": round(s_start, 3), "end": round(t, 3)})
    pieces.append(np.zeros(int(SR * 0.6), np.float32))
    audio = voice_master(np.concatenate(pieces))
    rel = f"{loc}/{length}.mp3"
    mp3(audio, SR, OUT / rel)
    manifest["tracks"].setdefault(loc, {})[length] = {
        "hash": track["hash"],
        "src": f"/studio/{rel}",
        "duration": round(len(audio) / SR, 3),
        "scenes": scenes,
        "sentences": sentences,
    }
    print(f"{loc}/{length}: {len(audio) / SR:6.1f}s, {len(sentences)} sentences", flush=True)


def build_commercial(loc: str, data: dict, manifest: dict) -> None:
    cfg = COMMERCIAL_VOICES[loc]
    beats, sentences, clips = [], [], []
    bar = INTRO_BARS
    for line in data["lines"]:
        if line["id"] == "reveal":
            bar += 1  # one bar of riser before the name
        start = bar * BAR
        t = start + VOICE_OFFSET + (BEAT if line["id"] == "reveal" else 0)
        v0 = t
        parts = split_sentences(line["text"])
        for j, s in enumerate(parts):
            wav = synth(s, loc, cfg)
            clips.append((t, wav))
            sentences.append({"beat": len(beats), "text": s, "start": round(t, 3), "end": round(t + len(wav) / SR, 3)})
            t += len(wav) / SR + (0.55 if line["id"] == "reveal" else 0.28 if j < len(parts) - 1 else 0)
        end_bar = math.ceil((t + 0.5) / BAR)
        beats.append({"id": line["id"], "bar": bar, "endBar": end_bar, "start": round(start, 3), "voiceStart": round(v0, 3), "voiceEnd": round(t, 3)})
        bar = end_bar
    # end card: two bars after the last line
    beats[-1]["endBar"] = bar + 2
    total = (bar + 3) * BAR
    for b, nxt in zip(beats, beats[1:] + [None]):
        b["end"] = round((nxt["start"] if nxt else beats[-1]["endBar"] * BAR), 3)

    voice = np.zeros(int(total * SR), np.float32)
    for at, wav in clips:
        i = int(at * SR)
        voice[i : i + len(wav)] += wav[: len(voice) - i]
    voice = voice_master(voice)
    music = compose_commercial(total, beats)

    mp3(voice, SR, OUT / loc / "commercial-voice.mp3", kbps=128)
    mp3(music, MSR, OUT / loc / "commercial-music.mp3", kbps=192)
    manifest.setdefault("commercial", {})[loc] = {
        **manifest.get("commercial", {}).get(loc, {}),
        "bpm": BPM,
        "bar": round(BAR, 4),
        "duration": round(total, 3),
        "voice": f"/studio/{loc}/commercial-voice.mp3",
        "music": f"/studio/{loc}/commercial-music.mp3",
        "narrator": cfg["voice"] if PROVIDER == "kokoro" else "elevenlabs",
        "beats": beats,
        "sentences": sentences,
    }
    print(f"{loc}/commercial: {total:5.1f}s, {len(beats)} beats", flush=True)


def main() -> None:
    if not SCRIPT.exists():
        sys.exit("Run `npm run studio:script` first.")
    if PROVIDER == "elevenlabs" and not os.environ.get("ELEVENLABS_API_KEY"):
        sys.exit("STUDIO_TTS=elevenlabs needs ELEVENLABS_API_KEY in the environment.")
    script = json.loads(SCRIPT.read_text(encoding="utf-8"))
    only = set(a for a in sys.argv[1:] if not a.startswith("-"))
    skip_summary = "--commercial-only" in sys.argv
    path = OUT / "manifest.json"
    manifest = json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}
    manifest.update({"version": 2, "engine": "ElevenLabs" if PROVIDER == "elevenlabs" else "Kokoro-82M"})
    manifest.setdefault("tracks", {})
    # drop the retired "video" cut
    for loc in manifest["tracks"].values():
        loc.pop("video", None)

    if not skip_summary:
        for track in script["tracks"]:
            if not only or track["locale"] in only:
                build_summary(track, manifest)
    for loc, data in script["commercial"].items():
        if not only or loc in only:
            build_commercial(loc, data, manifest)

    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("manifest.json written")


if __name__ == "__main__":
    main()
