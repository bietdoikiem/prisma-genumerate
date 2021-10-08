import { getDMMF } from '@prisma/sdk';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { DMMF } from '@prisma/generator-helper';
import prettier from 'prettier';

const readFile = promisify(fs.readFile);

// @ts-ignore
const getPrismaSchema = async (schemaPath: string) => {
  try {
    const schema = await readFile(path.join(process.cwd(), schemaPath), {
      encoding: 'utf-8',
    });

    const dmmf = await getDMMF({ datamodel: schema });

    return {
      models: dmmf.datamodel.models as DMMF.Model[],
      enums: dmmf.datamodel.enums,
    };
  } catch (err) {
    console.error(
      `prisma-genumerate failed to parse schema located at "${schemaPath}". Did you attempt to reference to a model without creating an alias? Remember you must define a "blank" alias model with only the "@id" field in your extended schemas otherwise we can't parse your schema.`,
      err
    );
    console.error(err.stack);
  }
};

const camelize = (str: string) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

const pascalize = (string: string) => {
  return `${string}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      (_$1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};

const parseEnumerates = (enums: DMMF.DatamodelEnum[]) => {
  let iterateEnums = enums.values();
  const listOfEnums: { [key: string]: string[] } = {};

  for (let o = iterateEnums.next(); o.done !== true; o = iterateEnums.next()) {
    listOfEnums[o.value.name] = o.value.values.map((o) => o.name);
  }

  return listOfEnums;
};

// PRETTIER UTILITY
let PRETTIER_OPTS: { [key: string]: any } = { singleQuote: true };

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

const formatWithPrettier = (output: string) => {
  return prettier.format(output, {
    parser: 'typescript', // or X parser
    ...PRETTIER_OPTS,
  });
};

export {
  getPrismaSchema,
  camelize,
  pascalize,
  parseEnumerates,
  formatWithPrettier,
};
