/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const globby = require('globby');
const { merge } = require('webpack-merge');
const {
  PROJECT_TYPES,
  PROJECT_CONFIG_PATH,
  PROJECT_NATIVE_CONFIG_PATH,
  BYBITIZENS_ROOT_PATH,
  APP_WEBPACK_PLUGINS_CONFIG_DIR,
  APP_WEBPACK_LOADERS_CONFIG_DIR,
  APP_NATIVE_CONFIG_FILE_NAME,
} = require('../constants');

const { PROJECT, PLATFORM } = process.env;
const { resolveModule, resolveMPAEntries, resolveApp } = require('./utils');

let configs = fs.existsSync(PROJECT_NATIVE_CONFIG_PATH)
  ? merge(require(PROJECT_CONFIG_PATH), require(PROJECT_NATIVE_CONFIG_PATH))
  : require(PROJECT_CONFIG_PATH);

if (!PROJECT || !PLATFORM) {
  throw new Error(chalk.red('PROJECT or PLATFORM is not specified!'));
}

const moreNativeConfig = path.resolve(
  BYBITIZENS_ROOT_PATH,
  PROJECT,
  APP_NATIVE_CONFIG_FILE_NAME,
);
if (fs.existsSync(moreNativeConfig)) {
  configs = merge(configs, { [PROJECT]: require(moreNativeConfig) });
}

if (!configs || !configs[PROJECT] || !configs[PROJECT][PLATFORM]) {
  throw new Error(
    `Configuration of application ${chalk.cyan(PROJECT)} of ${chalk.cyan(
      PLATFORM,
    )} platform ${chalk.red('DOES NOT EXIST')}!`,
  );
}

const appConfig = configs[PROJECT][PLATFORM];
const appIndexJs = resolveModule(resolveApp, 'index');
const appMPAEntries = resolveMPAEntries();

function detectAppType() {
  const isSPA = fs.existsSync(appIndexJs);
  const isMPA = !isSPA && appMPAEntries && !!appMPAEntries.length;
  const detectedType = isSPA ? PROJECT_TYPES.SPA : PROJECT_TYPES.MPA;
  if (PROJECT_TYPES.SPA === appConfig.type && !isSPA) {
    throw new Error(
      `工程配置文件 ${chalk.cyan('.marvelrc')} 中显示 ${chalk.cyan(
        PROJECT,
      )} 为单页应用，但${chalk.red('未检测到单页入口文件')}`,
    );
  }
  if (PROJECT_TYPES.MPA === appConfig.type && !isMPA) {
    throw new Error(
      `工程配置文件 ${chalk.cyan('.marvelrc')} 中显示 ${chalk.cyan(
        PROJECT,
      )} 为多页应用，但${chalk.red(
        isSPA ? '被检测到存在单页应用入口文件' : '被检测到不存在多页入口',
      )}`,
    );
  }
  return appConfig.type || detectedType;
}

function getSpecifiedWebpackConfig() {
  const files = globby.sync(
    [APP_WEBPACK_PLUGINS_CONFIG_DIR, APP_WEBPACK_LOADERS_CONFIG_DIR],
    {
      expandDirectories: {
        files: ['*.config.js'],
      },
    },
  );
  const result = {
    plugins: {},
    loaders: {},
  };
  try {
    files.forEach((filepath) => {
      const matchRes = filepath.match(
        /\/?(plugins|loaders)\/([^/]+)\.config\.js$/,
      );
      if (matchRes) {
        const config = require(filepath);
        if (config[PROJECT] && config[PROJECT][PLATFORM]) {
          result[matchRes[1]][matchRes[2]] = require(filepath)[PROJECT][
            PLATFORM
          ];
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
  return result;
}

module.exports = {
  ...appConfig,
  type: detectAppType(),
  appName: PROJECT,
  appPlatform: PLATFORM,
  appMPAEntries,
  getSpecifiedWebpackConfig,
  marvelProxySettings: {
    '/_marvel_api_': `http://localhost:${appConfig.mockPort}`,
  },
};
