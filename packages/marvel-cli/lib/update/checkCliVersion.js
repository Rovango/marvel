const cp = require('child_process');
const fse = require('fs-extra');
const { YARN_LOCK_FILE, CACHE, MARVEL_CLI_NAME } = require('../constants');

const useYarn = fse.existsSync(YARN_LOCK_FILE);
const cmd = useYarn ? 'yarn' : 'npm';

module.exports = async () => {
  return new Promise((resolve, reject) => {
    const process = cp.spawn(cmd, ['info', MARVEL_CLI_NAME, '--json']);
    let result = '';
    process.stdout.on('data', (data) => {
      result += data.toString();
    });
    process.stderr.on('data', (err) => console.log(err));
    process.stdout.on('close', () => {
      try {
        const forceUpdate = false;
        const json = JSON.parse(result);
        const {
          'dist-tags': { latest },
        } = useYarn ? json.data : json;

        resolve({ latest, forceUpdate, useYarn });

        // write cache
        fse.existsSync(CACHE.VERSION_CHECK_FILE) &&
          fse.writeJson(CACHE.VERSION_CHECK_FILE, {
            latest,
            checkTime: Date.now(),
          });
      } catch (e) {
        reject(e);
      }
    });
  }).catch((e) => {
    console.log(e);
    return {};
  });
};
