import { readFileSync, writeFileSync } from 'fs';
import process from 'process';
import arg from 'arg';

function printSyntax() {
  console.error(`Invalid arguments: follow this syntax\n`);
  console.error(`node prepare.js BROWSER MANIFEST_VERSION`);
  console.error(`   Keyword \t\tArgument\t\t\tAcceptable Values`);
  console.error(`-`.repeat(75));
  console.error(`   BROWSER \t\t-b, --browser \t\t\tfirefox or chrome`);
  console.error(`   MANIFEST_VERSION \t-m, --manifest_version \t\t2 or 3`);
  console.error(``);
}

function readManifest(pathToFile) {
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

const path = process.argv[1].replace('/dev/prepare.js', '');
const mPath = `${path}/manifest`;

(async () => {
  let mvPath;
  let manifest = readManifest(`${mPath}/base.json`);
  console.log(`Collected manifest base attributes`);

  mvPath = `${mPath}/v${args['--manifest_version']}`;
  manifest = {
    ...manifest,
    ...readManifest(`${mvPath}/base.json`),
  };
  console.log(
    `Collected manifest v${args['--manifest_version']} base attributes`,
  );

  manifest = {
    ...manifest,
    ...readManifest(`${mvPath}/${args['--browser']}.json`),
  };
  console.log(`Collected ${args['--browser']} manifest attributes`);

  writeFileSync(`${path}/src/manifest.json`, JSON.stringify(manifest), 'utf-8');
  console.log(`Created manifest successfully\n`);
})();
