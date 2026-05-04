import { defineConfig } from "tsdown";

const shared = {
  format: "cjs" as const,
  outDir: "dist-electron",
  sourcemap: true,
  outExtensions: () => ({ js: ".cjs" }),
};

export default defineConfig([
  {
    ...shared,
    entry: ["src/main.ts"],
    clean: true,
    noExternal: (id) => id.startsWith("@t3tools/") || id.startsWith("effect-acp"),
  },
  {
    ...shared,
    entry: ["src/preload.ts"],
  },
  {
    // Webview preload that powers element picking inside the in-app
    // browser. We inline `react-grab` (and its `bippy` peer) so the bundle
    // is fully self-contained and works on any third-party page without
    // additional network fetches.
    ...shared,
    entry: ["src/preview-pick-preload.ts"],
    noExternal: (id) =>
      id === "react-grab" ||
      id.startsWith("react-grab/") ||
      id === "bippy" ||
      id.startsWith("bippy/"),
  },
]);
