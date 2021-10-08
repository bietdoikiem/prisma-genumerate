import { getPrismaSchema, camelize, parseEnumerates } from './utils';

/**
 *  Generate list of necessary information regarding Prisma's schemas
 *
 * @param path Path to Prisma Schema file
 * @returns Model names, table names, Prisma Model names and Model enumerates
 */
const genumerate = async (path: string) => {
  let modelNames: string[] = [];
  let tableNames: string[] = [];
  let prismaModels: string[] = [];
  let modelEnums = {};
  const result = await getPrismaSchema(path);
  if (result) {
    modelNames = result.models.map((o: { name: any }) => o.name);
    tableNames = result.models.map((o: { dbName: any }) => o.dbName);
    tableNames = tableNames.filter((e) => e); // Filter null if @@map is not specified in Prisma schema
    prismaModels = result.models.map((o: { name: any }) => camelize(o.name));
    modelEnums = parseEnumerates(result.enums);
  }

  return {
    modelNames,
    tableNames,
    prismaModels,
    modelEnums,
  };
};

export default genumerate;
