# Prisma Genumerate V2 - A generator for model enumerates in Typescript

<p align="center">
<img alt="coffee-gif" width="176px" height="176px" src="https://media4.giphy.com/media/bsxxq0b0N5PdBqALlf/giphy.gif?cid=790b76114c47998bd0226dbe643042a22cd2899855381fc2&rid=giphy.gif&ct=g" />
</p>

## Overview 🔎

A little CLI tool which help developers to quickly generate Typescript enumerates based on Prisma models, model names, table names and Prisma enumerates. The enumerates generated can later be used for indexing Prisma client, indexing enum values or for further database operations.

## Quickstart 🚀

You can install it as the speed of light with NPM repo:

```bash
npm i prisma-genumerate
```

Here are the list of instructions for the CLI tool

```bash
Usage:
  $ prisma-genumerate [options] [...args]
Specify a Prisma schema file:
  $ prisma-genumerate ./schema.prisma -o [output-file-path.ts]
Instead of saving the result to the filesystem, you can also PRINT it:
  $ prisma-genumerate ./schema.prisma --print
  OR:
  $ prisma-genumerate ./schema.prisma -o [output-file-path.ts] --print
Options:
  --output Output file path (REQUIRED)
  --print   Do not save but print ONLY
  --help    Help
  --version Version info
```

**Note**: Remember to prepend the command with `npx` when installed at local workspace

### Example generated files

FROM This Prisma Schema:

```javascript
datasource db {
  provider = "postgresql"
  url      = "lorem-ipsum-postgresql-url"
}

generator client {
  provider = "prisma-client-js"
}

model Project {
  id          String         @id @default(uuid())
  ...
  @@map("project")
}

model Repository {
  id        String     @id @default(uuid())
  ...
  @@map("repository")
}

model Artifact {
  id           String     @id @default(uuid())
  ...
  @@map("artifact")
}

model Tag {
  id          String    @id @default(uuid())
  ...
  @@map("tag")
}

model ServiceAccount {
  id   String    @id @default(uuid())
  ...
  @@map("service_account")
}

// NOTE: Prisma Enums ONLY accept SNAKE_CASE (snake_case) to be transformed and generated correctly via the tool!
enum State {
  READY
  DELETED
  ERROR
  CREATING
  UPDATING
}

enum Status {
  ACTIVE
  DISABLED
  OFFLINE
}
```

TO This Enumerates:

```typescript
/* * Enumerates are ONLY allowed to modified by script, DO NOT MODIFY manually * */

enum PrismaModel {
  Project = 'project',
  Repository = 'repository',
  Artifact = 'artifact',
  Tag = 'tag',
  ServiceAccount = 'serviceAccount',
}

enum ModelName {
  Project = 'Project',
  Repository = 'Repository',
  Artifact = 'Artifact',
  Tag = 'Tag',
  ServiceAccount = 'ServiceAccount',
}

enum TableName {
  Project = 'project',
  Repository = 'repository',
  Artifact = 'artifact',
  Tag = 'tag',
  ServiceAccount = 'service_account',
}

enum StateEnum {
  Ready = 'READY',
  Deleted = 'DELETED',
  Error = 'ERROR',
  Creating = 'CREATING',
  Updating = 'UPDATING',
}

enum StatusEnum {
  Active = 'ACTIVE',
  Disabled = 'DISABLED',
  Offline = 'OFFLINE',
}

export { PrismaModel, ModelName, TableName, StateEnum, StatusEnum };
```

## Update logs

**BREAKING CHANGES! Version 2.0.x**: We now support parse all model names, table names (in @@map annotation) and even enumerate values in Prisma schema files! 🎊

> Since version 2.0.x, we're no longer utilize Regex in parsing model names as it a bit unreliable for some reasons. Instead, we're utilizing Prisma SDK to directly parse schemas and perform further processing steps to generate appropriate enumerates.

## Contribution Guide

If you want to contribute with me to make this tool even better, feel free to submit a merge request! I'm happy to review and merge it!

**Note**: You can run and develop locally by running `npm run watch` to start compiling TS files to JS files in `/dist` folder.

## Kudos 🍪

Thanks to the simple but efficient Regex snippet for parsing Prisma model of [@TLadd](https://github.com/TLadd) (version v1.0.x) and Prettier format snippet by [@hcharley](https://github.com/hcharley). Altogether, it is now possible to make this simple CLI script finally comes alive ❗
