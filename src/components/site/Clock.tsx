"use client";

import { useEffect, useState } from "react";

export function Clock({ timeZone, className = "" }: { timeZone: string; className?: string }) {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return (
    <span className={`tabular-nums ${className}`} suppressHydrationWarning>
      {now || "--:--:--"}
    </span>
  );
}
