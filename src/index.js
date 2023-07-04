#!/usr/bin/env node
const path = require('path');
const fs = require('fs/promises');

const yargs = require('yargs');
const fg = require('fast-glob');

const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;

const { getSource, getProperties, trimBasePath } = require('./utils');

/**
 *
 * @typedef {{
 *   _: Array<string>,
 *   "report-file": string,
 *   "root": string,
 *  }} Arguments
 */

/**
 *
 * @type Arguments
 */
// @ts-ignore
const argv = yargs
  .scriptName('find-react-legacy-context-usages')
  .usage('$0 <path-glob> --report-file=<report-file>')
  .command(
    '<path-glob>',
    'Path glob (Example: "src/**/*.{js,jsx,ts,tsx}")',
    (
      /** @type {{ positional: (arg0: string, arg1: { type: string; describe: string; }) => void; option: (arg0: string, arg1: { type: string; describe: string; }) => void; }} */ yargs,
    ) => {
      yargs.positional('path-glob', {
        type: 'string',
        describe: 'Path to folder containing .js or .jsx files. Example "src/**/*.{js,jsx,ts,tsx}"',
      });
      yargs.option('root', {
        type: 'string',
        describe: 'Root folder for sources where .babelrc exists',
      });
      yargs.option('report-file', {
        type: 'string',
        describe: 'Report file output path',
      });
    },
  )
  .demandCommand()
  .demandOption(['root', 'report-file'])
  .help().argv;

const pathGlob = argv._[0];
const reportFile = argv['report-file'];
const root = argv['root'];

/**
 *
 * @param {object} options
 * @param {string} options.pathGlob
 * @param {string} options.reportFile
 * @param {string} options.root
 * @return {Promise<void>}
 */
async function main({ pathGlob, reportFile, root }) {
  const files = await fg(pathGlob, { dot: true });
  if (files.length < 2) {
    console.warn(
      `Warning: ${files.length} matches found. Make sure you\'re passing the path-glob inside double-quotes.`,
    );
  } else {
    console.log(`Processing ${files.length} files...`);
  }

  /**
   * @type {{ filename: string; type: string; assignmentType: string; loc: babel.types.SourceLocation | null; properties: any; }[]}
   */
  const usages = [];

  for (const filename of files) {
    const relativeFilename = trimBasePath(path.resolve(filename), path.resolve(root));
    const code = await fs.readFile(filename, { encoding: 'utf-8' });
    if (code.includes('contextTypes') || code.includes('childContextTypes')) {
      const ast = await babel.parseAsync(code, {
        filename,
        root,
        presets: ['@babel/preset-typescript'],
      });
      const toCode = (/** @type {object} */ node) => getSource(node, code);
      traverse(ast, {
        ClassDeclaration: (path) => {
          const superClassValue = path.node.superClass ? toCode(path.node.superClass) : '';
          if (superClassValue === 'React.Component' || superClassValue === 'Component') {
            ['contextTypes', 'childContextTypes'].forEach((contextType) => {
              const contextTypeClassProperty = path.node.body.body.find((node) => {
                return (
                  node.type === 'ClassProperty' &&
                  node.key.type === 'Identifier' &&
                  node.key.name === contextType
                );
              });

              /**
               *
               * @type {import('@babel/types').ObjectExpression|null}
               */
              // @ts-ignore
              const objectExpression = contextTypeClassProperty && contextTypeClassProperty.value;
              if (objectExpression) {
                if (objectExpression.type === 'ObjectExpression') {
                  usages.push({
                    filename: relativeFilename,
                    type: contextType,
                    assignmentType: 'ClassProperty',
                    // @ts-ignore
                    loc: contextTypeClassProperty.loc,
                    properties: getProperties(objectExpression, relativeFilename),
                  });
                } else {
                  console.warn(
                    `Warning: Unsupported context type value "${objectExpression.type}" in file "${relativeFilename}" at line ${objectExpression.loc?.start.line}`,
                  );
                }
              }
            });
          }
        },
        AssignmentExpression: (path) => {
          ['contextTypes', 'childContextTypes'].forEach((contextType) => {
            if (toCode(path.node.left).endsWith(`.${contextType}`)) {
              if (path.node.right.type === 'ObjectExpression') {
                usages.push({
                  filename: relativeFilename,
                  type: contextType,
                  assignmentType: 'AssignmentExpression',
                  // @ts-ignore
                  loc: path.node.left.loc,
                  properties: getProperties(path.node.right, relativeFilename),
                });
              } else {
                console.warn(
                  `Warning: Unsupported context type value "${path.node.right.type}" in file "${relativeFilename}" at line ${path.node.right.loc?.start.line}`,
                );
              }
            }
          });
        },
      });
    }
  }

  const reportFilePath = path.resolve(reportFile);
  await fs.writeFile(reportFilePath, JSON.stringify(usages, null, 2));
  console.log(`Report successfully generated at "${reportFilePath}".`);
}

main({ pathGlob, reportFile, root }).then(() => {});
