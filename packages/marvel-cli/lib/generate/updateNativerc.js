/* eslint-disable no-console */
const fse = require('fs-extra');
const path = require('path');
const {
  PLATFORM_TYPES,
  BYBITIZENS_ROOT_PATH,
  RC,
  APP_NATIVE_CONFIG_FILE_NAME,
} = require('../constants');

function another(platform) {
  return platform === PLATFORM_TYPES.MOBILE
    ? PLATFORM_TYPES.DESKTOP
    : PLATFORM_TYPES.MOBILE;
}

function updateNativerc(name, platform) {
  const ap = another(platform);
  const anotherNativercReg = new RegExp(`${ap}\\s*:\\s*\\{[\\s\\S]*\\}\\s*,`, 'i');
  const nativerc = path.resolve(
    BYBITIZENS_ROOT_PATH,
    name,
    APP_NATIVE_CONFIG_FILE_NAME,
  );
  const content = fse.existsSync(nativerc) ? fse.readFileSync(nativerc, 'utf-8'): '';
  const anotherContent = anotherNativercReg.test(content)
    ? content.match(anotherNativercReg)[0]
    : `${ap}: {}`;
  fse.writeFileSync(
    nativerc,
    `module.exports = {
  ${platform}: {${RC.NATIVE}
  },
  ${anotherContent}
};\n`,
  );
}

module.exports = updateNativerc;
