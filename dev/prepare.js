import { readFileSync, writeFileSync } from 'fs';
import arg from 'arg';
import path from 'path';
import process from 'process';

function printSyntax() {
  console.error(`Invalid arguments: follow this syntax\n`);
  console.error(`node prepare.js BROWSER MANIFEST_VERSION`);
  console.error(`   Keyword \t\tArgument\t\t\tAcceptable Values`);
  console.error(`-`.repeat(75));
  console.error(`   BROWSER \t\t-b, --browser \t\t\tfirefox or chrome`);
  console.error(`   MANIFEST_VERSION \t-m, --manifest_version \t\t2 or 3`);
  console.error(``);
}

function readJson(pathToFile) {
  return JSON.parse(readFileSync(pathToFile, 'utf-8'));
}

const SUPPORTED_BROWSER = ['firefox', 'chrome'];
const SUPPORTED_VERSION = [2, 3];

let args;

try {
  args = arg({
    '--browser': String,
    '--manifest_version': Number,
    '--help': Boolean,
    '-h': '--help',
    '-b': '--browser',
    '-m': '--manifest_version',
  });
} catch (err) {
  printSyntax();
  process.exit(-1);
}

if (args['--help']) {
  printSyntax();
  process.exit(0);
}

if (!args['--browser'] || !args['--manifest_version']) {
  printSyntax();
  process.exit(-2);
}

if (
  !SUPPORTED_BROWSER.includes(args['--browser']) ||
  !SUPPORTED_VERSION.includes(args['--manifest_version'])
) {
  printSyntax();
  process.exit(-3);
}

const sDir = path.dirname(process.argv[1]);
const dir = path.normalize(path.join(sDir, '..'));
const mDir = path.join(dir, 'manifest');

(async () => {
  let mvDir;
  let _wp = path.join(dir, `package.json`);

  let pkg = readJson(_wp);
  console.log(`Collected app version using package.json from ${_wp}`);

  _wp = path.join(mDir, `base.json`);

  let manifest = readJson(_wp);
  manifest.version = pkg.version;
  console.log(`Collected manifest base attributes from ${_wp}`);

  mvDir = path.join(mDir, `v${args['--manifest_version']}`);
  _wp = path.join(mvDir, `base.json`);
  manifest = {
    ...manifest,
    ...readJson(_wp),
  };
  console.log(
    `Collected manifest v${args['--manifest_version']} base attributes from ${_wp}`,
  );

  _wp = path.join(mvDir, `${args['--browser']}.json`);
  manifest = {
    ...manifest,
    ...readJson(_wp),
  };
  console.log(`Collected ${args['--browser']} manifest attributes from ${_wp}`);

  (_wp = path.join(dir, `src`, `manifest.json`)),
    writeFileSync(_wp, JSON.stringify(manifest), 'utf-8');
  console.log(`Created manifest successfully into from ${_wp}\n`);
})();
