const { spawnSync } = require('child_process');
const program = require('commander');
const chalk = require('chalk');
const { helper } = require('../lib/utils');
const { MARVEL_CLI_NAME } = require('../lib/constants');

program
  .option('--patch', 'release a patch version')
  .option('--minor', 'release a minor version')
  .option('--major', 'release a major version')
  .parse(process.argv);

const runSync = (cmd, [...params]) => {
  const result = spawnSync(cmd, params);
  if (result.status) {
    console.log(result.stderr.toString().trim());
  } else {
    console.log(result.stdout.toString().trim());
  }
  return result.status;
};
const release = () => {
  const successMsg = 'Release Success';
  const failMsg = 'Release Failed';
  const workingTreeClean = spawnSync('git', ['status'])
    .stdout.toString()
    .includes('nothing to commit, working tree clean');
  if (!workingTreeClean) {
    return helper.printWithRectOutline(
      {
        [failMsg]: 'red',
        Git: 'cyan',
      },
      failMsg,
      'Please make your Git working tree clean first',
    );
  }

  const remote = spawnSync('git', ['remote']).stdout.toString().trim();
  const branch = spawnSync('git', ['branch', '--show-current'])
    .stdout.toString()
    .trim();
  if (branch !== 'master') {
    return helper.printWithRectOutline(
      {
        [failMsg]: 'red',
        [MARVEL_CLI_NAME]: 'cyan',
        master: 'cyan',
      },
      failMsg,
      `${MARVEL_CLI_NAME} can only be published on the master branch`,
    );
  }

  const account = spawnSync('npm', ['whoami']);
  const userName = account.stdout && account.stdout.toString();
  if (userName.trim() !== 'bybit') {
    console.log(`Please login npm with account ${chalk.cyan('bybit')} first.`);
    const h = spawnSync('npm', ['login'], { stdio: 'inherit' });
    if (h.status) return;
  }

  let type = 'patch';
  if (program.minor) type = 'minor';
  if (program.major) type = 'major';

  const version = spawnSync('npm', ['version', type]).stdout.toString().trim();

  if (
    !(
      runSync('npm', ['run', 'changelog']) ||
      runSync('npm', ['publish', '--access', 'public']) ||
      runSync('git', ['add', '.']) ||
      runSync('git', [
        'commit',
        '-m',
        `docs: update changelog for ${version}`,
      ]) ||
      runSync('git', ['push', remote, branch])
    )
  ) {
    helper.printWithRectOutline(
      {
        [successMsg]: 'green',
        [MARVEL_CLI_NAME]: 'cyan',
        [version]: 'yellow',
      },
      successMsg,
      `${MARVEL_CLI_NAME} ${version} has been publicly published`,
    );
  } else {
    helper.printWithRectOutline(
      {
        [failMsg]: 'red',
      },
      failMsg,
    );
  }
};

try {
  release();
} catch (e) {
  console.log(chalk.red('Release failed: '));
  console.log(e);
}
