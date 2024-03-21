import { readFileSync } from "fs";
import { cmd } from "web-ext";
import path from "path";
import process from "process";

const args = process.argv;
const sDir = path.dirname(process.argv[1]);
const dir = path.normalize(path.join(sDir, ".."));
const src = path.join(dir, "dist");
const dst = path.join(dir, "releases");

let tag = "";
if (args[2]) tag = `-${args[2]}`;

async function build(name) {
  await cmd.build({
    sourceDir: src,
    artifactsDir: dst,
    overwriteDest: true,
    filename: `${name}.zip`,
  });
}

(async () => {
  const time = Date.now();

  const manifest = JSON.parse(
    readFileSync(path.join(src, "manifest.json"), "utf-8"),
  );
  const { name, version } = manifest;

  await build(`${name}-${version}${tag}`);
  console.log(`built in ${Number((Date.now() - time) / 1000).toFixed(2)}s`);
})();
