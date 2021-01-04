const { default: lint } = require('@commitlint/lint');
const { default: load } = require('@commitlint/load');
const chalk = require('chalk');
const lintConf = require('./commitlint.config.js');

const lintCommitMessage = async (msg) => {
  const report = await load(lintConf).then((config) =>
    lint(
      msg,
      config.rules,
      config.parserPreset ? { parserOpts: config.parserPreset.parserOpts } : {},
    ),
  );

  if (!report.valid) {
    console.log();
    console.log(
      `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
        `invalid commit message format.`,
      )}\n`,
    );
    console.log(
      chalk.red(
        '  Proper commit message format is required for automated changelog generation.',
      ),
    );
    console.log();

    report.errors.forEach((item) => {
      console.log(
        `  ${chalk.red('✖')}  ${item.message} ${chalk.gray(`[${item.name}]`)}`,
      );
    });
    report.warnings.forEach((item) => {
      console.log(
        `  ${chalk.yellow('⚠')}  ${item.message} ${chalk.gray(
          `[${item.name}]`,
        )}`,
      );
    });
    console.log();
    console.log(
      `  Found ${chalk.bold(
        `${chalk.red(report.errors.length)} problems, ${chalk.yellow(
          report.warnings.length,
        )} warnings`,
      )} in you message: ${chalk.underline(msg)} .`,
    );
    console.log();
    console.log(
      `  A commit message consists of a ${chalk.cyan('header')}, ${chalk.cyan(
        'body',
      )} and ${chalk.cyan('footer')}. The header has a ${chalk.cyan(
        'type',
      )}, ${chalk.cyan('scope')} and ${chalk.cyan('subject')}:`,
    );
    console.log(
      chalk.green(`
        <type>(<scope>): <subject>
        <BLANK LINE>
        <body>
        <BLANK LINE>
        <footer>
      `),
    );
    console.log(
      `  The ${chalk.cyan('header')} is mandatory and the ${chalk.cyan(
        'scope',
      )} of the header is optional.`,
    );
    console.log();
    console.log(
      `  ⓘ  See ${chalk.cyan(
        'src/.marvel/commit-convention.md',
      )} for more detail.`,
    );
  }

  return report.valid;
};

const lintStagedFiles = (stagedFiles) => {
  const abnormalFiles = stagedFiles.filter(
    (f) => !f.startsWith('src/bybitizens'),
  );
  if (abnormalFiles.length > 0) {
    console.warn(`
  ${chalk.bgYellow.white(' WARNNING ')} 涉及${chalk.yellow(
      '整体工程管理',
    )}或${chalk.yellow('项目构建和部署')}的文件被提交。

  在一般的业务开发或迭代中，通常不会修改 ${chalk.cyan(
    'src/bybitizens',
  )} 目录以外的文件:

${abnormalFiles.map((f) => `    ${chalk.cyan(f)}\n`).join('')}
  请再次检查上面这${chalk.yellow(abnormalFiles.length)}个文件，并${chalk.yellow(
      '确保您十分清楚这些修改是必要的',
    )}。
`);
  }

  const envFiles = stagedFiles.filter((f) => /\/\.env/.test(f));
  if (envFiles.length > 0) {
    console.warn(`
  ${chalk.bgYellow.white(' WARNNING ')} 包含${chalk.yellow(
      '环境变量',
    )}的文件被提交。

  在一般的业务开发或迭代中，通常无须关注 ${chalk.cyan('.env*')} 文件:

${envFiles.map((f) => `    ${chalk.cyan(f)}\n`).join('')}
  这些文件的修改可能会${chalk.yellow('改变他人的开发环境')}，甚至${chalk.yellow(
      '影响测试和线上的部署流水线',
    )}。

  请再次检查上面那${chalk.yellow(envFiles.length)}个文件，并${chalk.yellow(
      '确保您十分清楚这些修改是必要的',
    )}。

  如果在开发过程中确需特殊的环境变量，可以考虑使用对他人无影响的 ${chalk.cyan(
    '.env.*.local',
  )} 文件。
`);
  }
};

module.exports = { lintCommitMessage, lintStagedFiles };
