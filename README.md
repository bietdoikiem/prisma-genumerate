# Prisma Genumerate - A generator for model enumerates in Typescript

<p align="center">
<img alt="coffee-gif" width="176px" height="176px" src="https://media4.giphy.com/media/bsxxq0b0N5PdBqALlf/giphy.gif?cid=790b76114c47998bd0226dbe643042a22cd2899855381fc2&rid=giphy.gif&ct=g" />
</p>

## Overview 🔎

A little CLI tool which help developers to quickly generate Typescript enumerates based on Prisma model. The enumerates generated can later be used for indexing Prisma client for further database operations.

## Quickstart 🚀

You can install it as the speed of light with NPM repo:

```bash
npm i prisma-genumerate
```

Here are the list of instructions for the CLI tool

```bash
Usage
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
  --version Version info
```

**Note**: Remember to prepend the command with `npx` when installed at local workspace

## Kudos 🍪

Thanks to the simple but efficient Regex snippet for parsing Prisma model of [@TLadd](https://github.com/TLadd) and Prettier format snippet by [@hcharley](https://github.com/hcharley) for making this simple CLI script possible!
