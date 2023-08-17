import { readFileSync } from 'fs';
import { cmd } from 'web-ext';
import process from 'process';

const args = process.argv;
const path = args[1].replace('/dev/release.js', '');
const src = `${path}/dist/`;
const dst = `${path}/releases/`;

let tag = '';
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
  const manifest = JSON.parse(readFileSync(`${src}manifest.json`, 'utf-8'));
  const { name, version } = manifest;

  await build(`${name}-${version}${tag}`);
})();
