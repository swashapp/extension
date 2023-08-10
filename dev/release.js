import { readFileSync, writeFileSync } from 'fs';
import { cmd } from 'web-ext';

const src = 'dist/';
const dst = 'releases/';

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

  await build(`${name}-${version}-chrome`);

  const worker = manifest.background.service_worker;
  manifest.background = {
    scripts: [worker],
    type: 'module',
  };
  manifest.browser_specific_settings = {
    gecko: {
      id: 'authsaz@gmail.com',
    },
  };
  writeFileSync(`${src}manifest.json`, JSON.stringify(manifest), 'utf-8');

  await build(`${name}-${version}-firefox`);
})();
