#! /usr/bin/env node

const pkg = require('../package.json');
const arg = require('arg');
const fs = require('fs');
const path = require('path');
const genumerate = require('../dist').default;
const utils = require('../dist/utils');

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

// COLOR TEXT FOR CLI OUTPUT
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

// Retrieve arguments from CLI
const schemaPath = args._[0];
const outputPath = args['--output'];
const isPrint = args['--print'] || false;

// MAIN SCRIPT
(async function main() {
  const text = fs.readFileSync(path.join(schemaPath), 'utf8');

  const result = await genumerate(schemaPath);

  const { prismaModels, modelNames, tableNames, modelEnums } = result;

  // Prepare write scripts
  const COMMENT_SCRIPT =
    '/* * Enumerates are ONLY allowed to modified by script, DO NOT MODIFY manually * */';
  // Prepare export scripts
  const PRISMA_MODELS_DECLARE_SCRIPT = 'enum PrismaModel';

  const MODEL_NAMES_DECLARE_SCRIPT = 'enum ModelName';

  const TABLE_NAMES_DECLARE_SCRIPT = 'enum TableName';

  // const MODEL_ENUMS_DECLARE_SCRIPT = 'enum ModelEnum';
  // const MODEL_ENUMS_EXPORT_SCRIPT = 'export ModelEnum;';
  let EXPORT_DECLARE_SCRIPT_WITHOUT_CLOSING =
    'export {PrismaModel,ModelName,TableName,';

  // Concat string for Prisma Models
  const prismaModelsTextList = [];
  if (prismaModels.length > 0) {
    for (let i = 0; i < modelNames.length; i++) {
      let concatString = `${utils.pascalize(prismaModels[i])}='${
        prismaModels[i]
      }'`;
      prismaModelsTextList.push(concatString);
    }
  }
  // Added text to file for Prisma Models
  const prismaModelsText = `
  ${PRISMA_MODELS_DECLARE_SCRIPT} {${prismaModelsTextList.join(',')}} \n `;

  // Concat string for Model Names
  const modelNamesTextList = [];
  if (modelNames.length > 0) {
    for (let i = 0; i < modelNames.length; i++) {
      let concatString = `${utils.pascalize(modelNames[i])}='${modelNames[i]}'`;
      modelNamesTextList.push(concatString);
    }
  }
  // Added text to file for Model Names
  const modelNamesText = `
    ${MODEL_NAMES_DECLARE_SCRIPT} {${modelNamesTextList.join(',')}} \n `;

  // Concat string for Table Names
  const tableNamesTextList = [];
  if (tableNames.length > 0) {
    for (let i = 0; i < tableNames.length; i++) {
      let concatString = `${utils.pascalize(tableNames[i])}='${tableNames[i]}'`;
      tableNamesTextList.push(concatString);
    }
  }
  // Added text to file for Model Names
  const tableNamesText =
    tableNames.length > 0
      ? `
    ${TABLE_NAMES_DECLARE_SCRIPT} {${tableNamesTextList.join(',')}} \n `
      : modelNamesText.replace('ModelName', 'TableName');

  /* Enum object properties loop for {EnumName}Enum */
  const enumNamesTextList = [];
  if (Object.keys(modelEnums).length > 0) {
    for (const e in modelEnums) {
      let tempTextList = [];
      for (let i = 0; i < modelEnums[e].length; i++) {
        let concatString = `${utils.pascalize(
          modelEnums[e][i].toLowerCase()
        )}='${modelEnums[e][i]}'`;
        tempTextList.push(concatString);
      }
      enumNamesTextList.push(`enum ${e}Enum {${tempTextList.join(',')}} \n`);
      EXPORT_DECLARE_SCRIPT_WITHOUT_CLOSING += `${e}Enum,`;
    }
  }

  /* * Aggregate all into file ➕ * */
  const aggregatedFileText = `${COMMENT_SCRIPT}
  ${prismaModelsText}
  ${modelNamesText}
  ${tableNamesText}
  ${enumNamesTextList.join('\n')}
  ${EXPORT_DECLARE_SCRIPT_WITHOUT_CLOSING}}
  `;

  // Format text using Prettier 🎨
  const formattedText = utils.formatWithPrettier(aggregatedFileText);

  // Check if missing --output AND --print options ⚠️ //
  if ((!outputPath || outputPath.length === 0) && !isPrint) {
    console.log(
      `Invalid argument. Missing --output (-o) argument, please specify it!
      OR you can specify --print argument just for printing result to the console!
      `
    );
    process.exit(1);
  }

  // Check if --print ONLY 🖨️
  if (isPrint) {
    console.log(getColoredText(formattedText, YELLOW));
    console.log(
      getColoredText('Print enumerates on the console successfully! ✅', CYAN)
    );
  } else {
    // Write .ts file ✍️
    fs.writeFileSync(outputPath, formattedText);
    console.log(
      getColoredText(
        'Generate enumerates for file at specified destination successfully! ✅',
        CYAN
      )
    );
  }
})();
