const chalk = require('chalk');

const padBlank = (origin = '', len = 66, char = ' ') => {
  const blankStart = Math.floor((len - origin.length) / 2);
  const blankEnd = Math.ceil((len - origin.length) / 2);
  let result = origin.padStart(origin.length + blankStart, char);
  result = result.padEnd(result.length + blankEnd, char);
  return `${chalk.yellow('│')}${result}${chalk.yellow('│')}`;
};

const printWithRectOutline = (
  { blankLen = 3, ...colorOpts } = {},
  ...lines
) => {
  const maxLen = lines.reduce((prev, next) => Math.max(prev, next.length), 0);
  const actualLen = maxLen + blankLen * 2;
  const coloredKeys = Object.keys(colorOpts);
  const printLines = lines
    .map((line) => padBlank(line, actualLen))
    .map((line) =>
      coloredKeys.reduce(
        (prev, next) => prev.replace(next, chalk[colorOpts[next]](next)),
        line,
      ),
    );
  const startLine = chalk.yellow(`╭${'─'.repeat(actualLen)}╮`);
  const blankLine = chalk.yellow(`│${' '.repeat(actualLen)}│`);
  const endLine = chalk.yellow(`╰${'─'.repeat(actualLen)}╯`);
  console.log(`
  ${startLine}
  ${blankLine}`);
  printLines.forEach((line) => console.log(`  ${line}`));
  console.log(`  ${blankLine}
  ${endLine}
  `);
};

const basicErrorData = (data = {}) => {
  return {
    ext_code: '',
    ext_info: '',
    result: null,
    'ret_code|10007-12000': 10007,
    ret_msg: typeof data === 'string' ? data : 'Basic error data',
    time_now: Date.now(),
    token: '',
    ...data,
  };
};

module.exports = {
  printWithRectOutline,
  basicErrorData,
};
