import path from "node:path";
import { resolve } from "path";
import { defineConfig, Plugin } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const TARGET = process.env.TARGET ?? "chrome";
const UselessWarning = "Module level directives cause errors when bundled";

const exTrim = (name: string | undefined) =>
  name?.replace(path.extname(name), "");

export default defineConfig({
  root: "src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      onwarn: (warning, warn) => {
        if (warning.message.includes(UselessWarning)) return;
        warn(warning);
      },
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "public"),
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    nodePolyfills({
      globals: { global: true },
    }),
    svgr({ include: "**/*.svg?react" }),
    webExtension({
      browser: TARGET,
      additionalInputs: [
        "ui/dashboard.html",
        "ui/new-tab.html",
        "core/scripts/ads.script.ts",
        "core/scripts/ajax.script.ts",
        "core/scripts/content.script.ts",
        "core/scripts/sdk.script.ts",
        "core/scripts/inpage/sdk.script.ts",
      ],
      manifest: () => {
        const pkg = readJsonFile("package.json");
        const manifest = {
          ...readJsonFile(`manifest/base.json`),
          ...readJsonFile(`manifest/${TARGET}.json`),
        };
        manifest.version = pkg.version;

        console.log(`Created manifest for ${TARGET}`);
        return manifest;
      },
      webExtConfig: {
        target: TARGET === "chrome" ? "chromium" : "firefox-desktop",
      },
    }) as Plugin,
    {
      name: "rewrite-paths",
      config(config) {
        const output = config.build?.rollupOptions?.output;
        if (!output || Array.isArray(output)) return;

        output.chunkFileNames = () => {
          return `chunks/js/[name].js`;
        };

        output.assetFileNames = ({ name }) => {
          if (!name) return `[name].[ext]`;
          if (name.endsWith(".css")) return `chunks/styles/${name}`;
          return `${exTrim(name)}.[ext]`;
        };

        return config;
      },
    },
  ],
});
