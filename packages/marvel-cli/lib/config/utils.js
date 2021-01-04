const fs = require('fs');
const glob = require('glob');
const path = require('path');
const crypto = require('crypto');
const {
  BYBITIZENS_ROOT_PATH,
  PROJECT_ROOT_PATH,
  MARVEL_ROOT_PATH,
  MODULE_FILE_EXTENSIONS,
  MARVEL_CLI_LIB_PATH,
} = require('../constants');

const { PROJECT, PLATFORM } = process.env;

const appDirectory = path.resolve(
  BYBITIZENS_ROOT_PATH,
  `${PROJECT}/${PLATFORM}`,
);

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const resolveProject = (relativePath) =>
  path.resolve(PROJECT_ROOT_PATH, relativePath);

const resolveMarvel = (relativePath) =>
  path.resolve(MARVEL_ROOT_PATH, relativePath);

const resolveMarvelCliLib = (relativePath) =>
  path.resolve(MARVEL_CLI_LIB_PATH, relativePath);

// 用同webpack一样的顺序解析文件路径
const resolveModule = (resolveFn, filePath) => {
  const extension = MODULE_FILE_EXTENSIONS.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const resolveMPAEntries = () => {
  if (fs.existsSync(resolveModule(resolveApp, 'index'))) {
    // 若是单页应用则直接返回空
    return [];
  }
  const nameReg = /(?<=\/)pages\/([^/]+)$/;
  return glob
    .sync(`${appDirectory}/pages/*`)
    .filter((p) => nameReg.test(p))
    .map((p) => p.match(nameReg))
    .map((p) => [p[1], resolveModule(resolveApp, `${p[0]}/index`)])
    .filter((p) => fs.existsSync(p[1]));
};

const hashing = (content, algorithm = 'sha1') =>
  crypto.createHash(algorithm).update(content)
    .digest('hex');

module.exports = {
  resolveApp,
  resolveProject,
  resolveMarvel,
  resolveMarvelCliLib,
  resolveModule,
  resolveMPAEntries,
  hashing
};
