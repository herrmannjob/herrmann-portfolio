"use client";

import { useCallback, useEffect, useRef, useState } from "react";
export { splitSentences } from "@/lib/summary";

/**
 * Thin wrapper over the Web Speech API (speechSynthesis).
 * Text is spoken one chunk at a time — long utterances get cut off in
 * Chromium, and per-chunk callbacks let the UI follow along.
 */

export type SpeechState = "idle" | "speaking" | "paused";


export function useSpeech(lang: string) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [state, setState] = useState<SpeechState>("idle");
  const runId = useRef(0);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const base = lang.split("-")[0]!.toLowerCase();
      const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(base));
      // Exact region first, then local voices, then the rest.
      all.sort(
        (a, b) =>
          Number(b.lang.toLowerCase() === lang.toLowerCase()) - Number(a.lang.toLowerCase() === lang.toLowerCase()) ||
          Number(b.localService) - Number(a.localService),
      );
      setVoices(all);
      setVoiceURI((cur) => (all.some((v) => v.voiceURI === cur) ? cur : all[0]?.voiceURI ?? ""));
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [lang, supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    runId.current++;
    window.speechSynthesis.cancel();
    setState("idle");
  }, [supported]);

  useEffect(() => stop, [stop]);

  /**
   * Speaks each chunk in order. `onChunk(i)` fires when chunk i starts;
   * resolves true when everything was spoken, false if stopped.
   */
  const speak = useCallback(
    (chunks: string[], onChunk?: (i: number) => void): Promise<boolean> => {
      if (!supported || !chunks.length) return Promise.resolve(false);
      window.speechSynthesis.cancel();
      const id = ++runId.current;
      const voice = voices.find((v) => v.voiceURI === voiceURI);
      setState("speaking");
      return new Promise((resolve) => {
        const next = (i: number) => {
          if (id !== runId.current) return resolve(false);
          if (i >= chunks.length) {
            setState("idle");
            return resolve(true);
          }
          const u = new SpeechSynthesisUtterance(chunks[i]);
          u.lang = voice?.lang ?? lang;
          if (voice) u.voice = voice;
          u.rate = rate;
          u.onstart = () => onChunk?.(i);
          u.onend = () => next(i + 1);
          u.onerror = (e) => {
            if (e.error === "interrupted" || e.error === "canceled") return resolve(false);
            next(i + 1);
          };
          window.speechSynthesis.speak(u);
        };
        next(0);
      });
    },
    [supported, voices, voiceURI, rate, lang],
  );

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setState("speaking");
  }, [supported]);

  return { supported, voices, voiceURI, setVoiceURI, rate, setRate, state, speak, stop, pause, resume };
}
