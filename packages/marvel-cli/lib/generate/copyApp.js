const fse = require('fs-extra');
const { MARVEL_CLI_ROOT_PATH, BYBITIZENS_ROOT_PATH } = require('../constants');

function copyApp(name, platform, type) {
  if (!fse.existsSync(BYBITIZENS_ROOT_PATH)) {return;}
  const tplPath = `${MARVEL_CLI_ROOT_PATH}/projects/${platform}_${type}`;
  if (!fse.existsSync(tplPath)) {return;}
  const appRoot = `${BYBITIZENS_ROOT_PATH}/${name}`;
  fse.ensureDir(appRoot);

  const appOrigin = `${tplPath}/${platform}`;
  const appDest = `${appRoot}/${platform}`;
  fse.copySync(appOrigin, appDest, { dereference: true });

  const httpMockOrigin = `${tplPath}/__mocks__/http/${platform}`;
  const httpMockDest = `${appRoot}/__mocks__/http/${platform}`;
  fse.copySync(httpMockOrigin, httpMockDest, { dereference: true });

  const wsMockOrigin = `${tplPath}/__mocks__/ws/${platform}`;
  const wsMockDest = `${appRoot}/__mocks__/ws/${platform}`;
  fse.copySync(wsMockOrigin, wsMockDest, { dereference: true });

  const testOrigin = `${tplPath}/__tests__/${platform}`;
  const testDest = `${appRoot}/__tests__/${platform}`;
  fse.copySync(testOrigin, testDest, { dereference: true });
}

module.exports = copyApp;
