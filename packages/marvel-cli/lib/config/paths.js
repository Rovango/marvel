// const glob = require('glob');
const path = require('path');
const fs = require('fs');
const url = require('url');
const {
  MARVEL_ROOT_PATH,
  MODULE_FILE_EXTENSIONS: moduleFileExtensions,
  BYBITIZENS_ROOT_PATH,
} = require('../constants');
const {
  resolveApp,
  resolveProject,
  resolveMarvel,
  resolveMarvelCliLib,
  resolveModule,
  hashing,
} = require('./utils');

const { PROJECT, PLATFORM, PUBLIC_URL: envPublicUrl, NODE_ENV } = process.env;
const appConfig = require('./app');

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith('/');
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
}

const resolveAlias = (alias) =>
  alias
    .replace(/^common(?=\/)/, `${BYBITIZENS_ROOT_PATH}/common`)
    .replace(/^@@(?=\/)/, MARVEL_ROOT_PATH)
    .replace(/^@(?=\/)/, resolveApp('.'))
    .replace(/\/+/g, '/');

const getPublicUrl = () => envPublicUrl || appConfig.publicPath;

function getServedPath() {
  const publicUrl = getPublicUrl();
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

function getTemplate() {
  const unifiedPublic = resolveMarvelCliLib(`template/${PLATFORM}/${NODE_ENV}`);
  const unifiedHtml = path.join(unifiedPublic, 'index.html');
  let configPublic = resolveAlias(appConfig.templateRoot);
  configPublic = path.isAbsolute(configPublic)
    ? configPublic
    : resolveApp(configPublic);
  const configHtml = path.join(configPublic, 'index.html');
  return {
    appPublic: fs.existsSync(configPublic) ? configPublic : unifiedPublic,
    appHtml: fs.existsSync(configHtml) ? configHtml : unifiedHtml,
  };
}

function getBuildDestination() {
  if (appConfig.buildDest) {
    const configDest = resolveAlias(appConfig.buildDest);
    return path.isAbsolute(configDest)
      ? configDest
      : resolveProject(configDest);
  }
  return resolveProject(`dist/${PROJECT}/${PLATFORM}`);
}

function getHtmlDestination() {
  if (appConfig.htmlDest) {
    const configDest = resolveAlias(appConfig.htmlDest);
    return path.isAbsolute(configDest)
      ? configDest
      : resolveProject(configDest);
  }
  return '';
}

const { appPublic, appHtml } = getTemplate();
module.exports = {
  dotenv: resolveApp('.env'),
  dotenvMulti: resolveApp('env/.env'), // 兼容bybit_fe
  appPath: resolveApp('.'),
  appBuild: getBuildDestination(),
  appPublic,
  appHtml,
  appHtmlDest: getHtmlDestination(),
  appIndexJs: resolveModule(resolveApp, 'index'),
  appPackageJson: resolveProject('package.json'),
  appMPAEntries: appConfig.appMPAEntries,
  projectPackageJson: resolveProject('package.json'),
  appSrc: resolveApp('.'),
  appTsConfig: resolveApp('tsconfig.json'),
  appHash: hashing(`${PROJECT}${PLATFORM}`).slice(-8),
  projectTsConfig: resolveProject('tsconfig.json'),
  yarnLockFile: resolveProject('yarn.lock'),
  // testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  testsSetup: resolveModule(resolveApp, 'setupTests'),
  // proxySetup: resolveApp('src/setupProxy.js'),
  proxySetup: resolveApp('setupProxy.js'),
  // appNodeModules: resolveApp('node_modules'),
  appNodeModules: resolveProject('node_modules'),
  publicUrl: getPublicUrl(),
  servedPath: getServedPath(),
  marvelPath: resolveMarvel('.'),
  commonPath: resolveProject('src/bybitizens/common'),
  bundleAnalyzerPath: resolveProject(`.analyzer/${PROJECT}/${PLATFORM}/bundle`),
  speedMeasurePath: resolveProject(`.analyzer/${PROJECT}/${PLATFORM}/speed`),
  sentryPropsFileRootPath: resolveApp('env'),
};

module.exports.moduleFileExtensions = moduleFileExtensions;
