#! /usr/bin/env node

const pkg = require('../package.json');
const prettier = require('prettier');
const arg = require('arg');
const fs = require('fs');
const path = require('path');

const args = arg({
  // Types
  '--help': Boolean,
  '--version': Boolean,
  '--print': Boolean,
  '--output': String,
  // Aliases
  '-v': '--version',
  '-o': '--output',
});

if (args['--version']) {
  console.log(`${pkg.name} ${pkg.versions}`);
  process.exit(0);
}

if (args['--help']) {
  console.log(`Usage
  $ prisma-genumerate [options] [...args]
Specify a Prisma schema file:
  $ prisma-genumerate ./schema.prisma -o [output-file-path.ts]
Instead of saving the result to the filesystem, you can also PRINT it
  $ prisma-genumerate ./schema.prisma --print
  OR:
  $ prisma-genumerate ./schema.prisma -o [output-file-path.ts] --print
Options:
  --output Output file path (REQUIRED)
  --print   Do not save but print ONLY
  --help    Help
  --version Version info`);
  process.exit(0);
}

// Check if there are no arguments provided
if (args._.length !== 1) {
  console.log(
    'Invalid argument. Require one positional argument. Run --help for usage.'
  );
  process.exit(1);
}

// Helper functions //
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

function snakelize(str) {
  return str
    .trim()
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase();
}

// PRETTIER UTILITY
let PRETTIER_OPTS = { singleQuote: true };

if (!process.env._HAS_RESOLVED_PRETTIER) {
  const prettierConfigPath = prettier.resolveConfigFile.sync();
  if (prettierConfigPath) {
    const o = prettier.resolveConfig.sync(prettierConfigPath);
    if (o) {
      PRETTIER_OPTS = o;
    }
  }
  process.env._HAS_RESOLVED_PRETTIER = 'true';
}

function formatWithPrettier(output) {
  return prettier.format(output, {
    parser: 'typescript', // or X parser
    ...PRETTIER_OPTS,
  });
}

// COLOR UTIL
const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';
const getColoredText = (text, color) => {
  if (color == null) {
    color = WHITE;
  }

  // remember to add reset at the end.
  return color + text + RESET;
};

// MAIN SCRIPT
const schemaPath = args._[0];
const outputPath = args['--output'];
const isPrint = args['--print'] || false;
(function fixPrismaFile() {
  const text = fs.readFileSync(path.join(schemaPath), 'utf8');

  const textAsArray = text.split('\n');

  const modelNames = [];
  let currentModelName = null;

  for (let line of textAsArray) {
    // Check if we're at the start of a model definition
    const modelMatch = line.match(/^model (\w+) {$/);
    if (modelMatch) {
      currentModelName = modelMatch[1];
      modelNames.push(currentModelName);
      continue;
    }
    // We don't need to change anything if we aren't in a model body
    if (!currentModelName) {
      continue;
    }
  }

  // Transform model names
  const snakeCaseModelNames = modelNames.map((name) =>
    snakelize(name).toUpperCase()
  );
  const camelCaseModelNames = modelNames.map((name) => camelize(name));

  // Prepare write scripts
  const COMMENT_SCRIPT =
    '// Enumerate constants are ONLY allowed to modified by script, DO NOT MODIFY manually';
  const ENUM_DECLARE_SCRIPT = 'enum PrismaModelEnum';
  const EXPORT_SCRIPT = 'export default PrismaModelEnum;';
  const fileTextList = [];
  for (let i = 0; i < modelNames.length; i++) {
    let concatString = `${snakeCaseModelNames[i]}='${camelCaseModelNames[i]}'`;
    fileTextList.push(concatString);
  }
  // Added text to file
  const fileText = `${COMMENT_SCRIPT}
  ${ENUM_DECLARE_SCRIPT} {${fileTextList.join(',')}}
  ${EXPORT_SCRIPT}`;
  const formattedText = formatWithPrettier(fileText);

  // Check if missing --output AND --print options
  if ((!outputPath || outputPath.length === 0) && !isPrint) {
    console.log(
      `Invalid argument. Missing --output (-o) argument, please specify it!
      OR you can specify --print argument just for printing result to the console!
      `
    );
    process.exit(1);
  }

  // Check if --print ONLY
  if (isPrint) {
    console.log(getColoredText(formattedText, YELLOW));
    console.log(
      getColoredText('Print enumerates on the console successfully! ✅', CYAN)
    );
  } else {
    // Write Ts file
    console.log(
      getColoredText(
        'Generate enumerates for file at specified destination successfully! ✅',
        CYAN
      )
    );
    fs.writeFileSync(outputPath, formattedText);
  }
})();
