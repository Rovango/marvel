const chalk = require('chalk');

const argMap = new Map([
  ['emit', () => require('./emit')],
]);

function printCommanders() {
  console.log('Until now, the commanders below are supported:');
  // eslint-disable-next-line no-restricted-syntax
  for (const key of argMap.keys()) {
    console.log(chalk.green(`  ${key}`));
  }
}

const args = process.argv.slice(2);
const cmd = argMap.get(args[0]);
if (args.length <= 0) {
  require('./mock-server');
} else if (cmd) {
  cmd();
} else {
  console.log(
    chalk.yellow(`
    Commander "${chalk.red(args[0])}" is not supported by @bybit/marvel-mock-server.
  `),
  );
  printCommanders();
}
