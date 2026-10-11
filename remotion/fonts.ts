import { loadFont as loadDisplay } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadSans } from "@remotion/google-fonts/InterTight";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSC } from "@remotion/google-fonts/NotoSansSC";

// Same type system as the site.
const display = loadDisplay("normal", { weights: ["800", "900"], subsets: ["latin", "latin-ext"] });
const sans = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] });
const mono = loadMono("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] });

let cjk = "";
/** Chinese glyphs come in hundreds of font slices — only load them for the zh video. */
export function fontsFor(locale: string) {
  if (locale === "zh" && !cjk) {
    cjk = loadSC("normal", { weights: ["500", "700"], ignoreTooManyRequestsWarning: true }).fontFamily;
  }
  const sc = cjk ? `${cjk}, ` : "";
  return {
    display: `${display.fontFamily}, ${sc}Impact, sans-serif`,
    sans: `${sans.fontFamily}, ${sc}system-ui, sans-serif`,
    mono: `${mono.fontFamily}, ${sc}ui-monospace, monospace`,
  };
}

/** Font stacks used by every component; Presentation switches them to the video locale. */
export const F = fontsFor("en");
export function useLocaleFonts(locale: string) {
  Object.assign(F, fontsFor(locale));
}
