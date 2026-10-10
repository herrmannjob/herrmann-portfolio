"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Types and deletes each role, terminal style. */
export function RoleTicker({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState(roles[0] ?? "");
  const [phase, setPhase] = useState<"hold" | "delete" | "type">("hold");

  useEffect(() => {
    if (reduce || roles.length < 2) return;
    const target = roles[i % roles.length]!;
    let t: ReturnType<typeof setTimeout>;
    if (phase === "hold") t = setTimeout(() => setPhase("delete"), 2200);
    else if (phase === "delete") {
      if (text.length === 0) {
        setI((v) => v + 1);
        setPhase("type");
      } else t = setTimeout(() => setText((s) => s.slice(0, -1)), 28);
    } else {
      const next = roles[i % roles.length]!;
      if (text === next) setPhase("hold");
      else t = setTimeout(() => setText(next.slice(0, text.length + 1)), 55);
    }
    void target;
    return () => clearTimeout(t);
  }, [phase, text, i, roles, reduce]);

  return (
    <span aria-live="off">
      <span className="sr-only">{roles.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="animate-blink">▍</span>
      </span>
    </span>
  );
}
