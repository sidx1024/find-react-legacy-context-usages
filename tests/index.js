const util = require('util');
const exec = util.promisify(require('child_process').exec);
const assert = require('assert');
const fs = require('fs');

const ROOT = './tests/sources/';

/**
 *
 * @type {{name: string, fn: function(): Promise<*>}[]}
 */
let testsToRun = [];

test('works with class component', async () => {
  const reportFile = './tests/tmp/class-component-report.json';
  await exec(
    `node src/index.js "./tests/sources/ClassComponent/**/*.{js,jsx}" --root=${ROOT} --report-file="${reportFile}"`,
  );
  const actual = JSON.parse(fs.readFileSync(reportFile, { encoding: 'utf-8' }));
  const expected = JSON.parse(
    fs.readFileSync('./tests/expected/class-component-report.json', { encoding: 'utf-8' }),
  );
  assert.deepStrictEqual(actual, expected);
});

test('works with functional component', async () => {
  await clearTempDirectory();
  const reportFile = './tests/tmp/functional-component-report.json';
  await exec(
    `node src/index.js "./tests/sources/FunctionalComponent/**/*.{js,jsx}" --root=${ROOT} --report-file="${reportFile}"`,
  );
  const actual = JSON.parse(fs.readFileSync(reportFile, { encoding: 'utf-8' }));
  const expected = JSON.parse(
    fs.readFileSync('./tests/expected/functional-component-report.json', { encoding: 'utf-8' }),
  );
  assert.deepStrictEqual(actual, expected);
});

/**
 *
 * @param {string} name
 * @param {function(): Promise<*>} fn
 */
function test(name, fn) {
  testsToRun.push({ name, fn });
}

Promise.resolve().then(async () => {
  let name;
  try {
    for (const test of testsToRun) {
      name = test.name;
      await test.fn();
      console.log('Test passed:', name);
    }
    console.log('\nAll tests passed!');
  } catch (e) {
    console.error(`Test failed :`, name);
    console.error(e);
    process.exit(1);
  }
});

async function clearTempDirectory() {
  await exec('rm -rf ./tests/tmp/');
  await exec('mkdir ./tests/tmp/');
}
