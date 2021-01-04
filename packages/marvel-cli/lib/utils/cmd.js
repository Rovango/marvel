const cp = require('child_process');
const path = require('path');
const { MARVEL_CLI_ROOT_PATH } = require('../constants');

const run = ([cmd, ...params]) =>
  cp.spawn(cmd, params, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

const runSync = ([cmd, ...params]) =>
  cp.spawnSync(cmd, params, {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

const runInherit = ([cmd, ...params]) =>
  cp.spawn(cmd, params, { stdio: 'inherit' });

const runInheritSync = ([cmd, ...params]) =>
  cp.spawnSync(cmd, params, {
    stdio: 'inherit',
  });

const nodeBin = (cmd) =>
  path.resolve(MARVEL_CLI_ROOT_PATH, `node_modules/.bin/${cmd}`);

module.exports = {
  run,
  runSync,
  runInherit,
  runInheritSync,
  nodeBin,
};
