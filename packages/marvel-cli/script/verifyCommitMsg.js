// Invoked on the commit-msg git hook by yorkie.
// const { spawnSync } = require('child_process');
const fs = require('fs');
const {
  lintCommitMessage,
  // lintStagedFiles
} = require('../lib/scripts/commitlint');

// const stagedFiles = spawnSync('git', ['diff', '--cached', '--name-only'])
//   .stdout.toString()
//   .trim()
//   .split(/\r?\n/)
//   .filter((f) => f.trim() !== '');
// lintStagedFiles(stagedFiles);

const msgPath = process.env.GIT_PARAMS;
const msg = fs
  .readFileSync(msgPath, 'utf-8')
  .replace(/(?<=\r?\n)#.*(\r?\n)?/g, '')
  .trim();
lintCommitMessage(msg).then((valid) => {
  if (!valid) process.exit(1);
});
