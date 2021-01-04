const chalk = require('chalk');
const { checkUpdate } = require('./utils');

const argMap = new Map([
  ['init', () => require('./initialize')],
  ['generate', () => require('./generate')],
  ['start', () => require('./dev-server')],
  ['build', () => require('./build')],
  ['test', () => require('./test')],
  ['mock', () => require('./mock-server')],
  ['analyze', () => require('./analyze')],
  ['verifyCommitMsg', () => require('./scripts/verifyCommitMsg')],
  ['nativerc', () => require('./nativerc')],
  ['update', () => require('./update')],
  ['version', () => require('./version')],
]);

function printCommanders() {
  console.log('Until now, the commanders below are supported:');
  // eslint-disable-next-line no-restricted-syntax
  for (const key of argMap.keys()) {
    console.log(chalk.green(`  ${key}`));
  }
}

const args = process.argv.slice(2);

try {
  if (args[0] !== 'update') checkUpdate();
} catch (e) {
  /* it is empty, just do nothing */
}

const cmd = argMap.get(args[0]);
if (args.length > 0 && cmd) {
  cmd();
} else if (args.length <= 0) {
  console.log(
    chalk.yellow(`
    No commander is specified.
  `),
  );
  printCommanders();
} else if (!cmd) {
  console.log(
    chalk.yellow(`
    Commander "${chalk.red(args[0])}" is not supported by @bybit/marvel-cli.
  `),
  );
  printCommanders();
}
