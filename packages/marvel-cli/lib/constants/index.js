const path = require('path');
const fs = require('fs');

exports.VERSION = require('./VERSION');

exports.MARVEL_CLI_NAME = require('./NAME');

exports.PROJECT_TYPES = require('./types/project-types.js');

exports.PLATFORM_TYPES = require('./types/platform-types.js');

exports.CHOICES = require('./choices');

exports.COLORS = require('./colors');

exports.RC = require('./rc');

exports.TIME = require('./time');

exports.CACHE = require('./cache');

exports.MODULE_FILE_EXTENSIONS = require('./moduleFileExtensions');

exports.APP_CONFIG_FILE_NAME = '.marvelrc.js';

exports.APP_NATIVE_CONFIG_FILE_NAME = '.marvelrc-native.js';

exports.PROJECT_ROOT_PATH = fs.realpathSync(process.cwd());

exports.MARVEL_CLI_ROOT_PATH = path.resolve(__dirname, '../../');

exports.MARVEL_CLI_LIB_PATH = path.resolve(exports.MARVEL_CLI_ROOT_PATH, 'lib');

exports.MARVEL_CLI_UI_ROOT = path.resolve(exports.MARVEL_CLI_ROOT_PATH, 'ui');

exports.PROJECT_CONFIG_PATH = path.resolve(
  exports.PROJECT_ROOT_PATH,
  exports.APP_CONFIG_FILE_NAME,
);

exports.PROJECT_NATIVE_CONFIG_PATH = path.resolve(
  exports.PROJECT_ROOT_PATH,
  exports.APP_NATIVE_CONFIG_FILE_NAME,
);

exports.DEV_SERVER_PATH = path.resolve(
  exports.MARVEL_CLI_LIB_PATH,
  'dev-server/start.js',
);

exports.MOCK_SERVER_PATH = path.resolve(
  exports.MARVEL_CLI_LIB_PATH,
  'mock-server/index.js',
);

exports.BUILD_SCRIPT_PATH = path.resolve(
  exports.MARVEL_CLI_LIB_PATH,
  'build/build.js',
);

exports.TEST_SCRIPT_PATH = path.resolve(
  exports.MARVEL_CLI_LIB_PATH,
  'test/test.js',
);

exports.TEMPLATE_ROOT_PATH = path.resolve(
  exports.MARVEL_CLI_LIB_PATH,
  'template',
);

exports.BYBITIZENS_ROOT_PATH = path.resolve(
  exports.PROJECT_ROOT_PATH,
  'src/bybitizens',
);

exports.DIST_ROOT_PATH = path.resolve(exports.PROJECT_ROOT_PATH, 'dist');

exports.ANALYZER_ROOT_PATH = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.analyzer',
);

exports.COVERAGE_ROOT_PATH = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.coverage',
);

exports.MARVEL_ROOT_PATH = path.resolve(
  exports.PROJECT_ROOT_PATH,
  'src/.marvel',
);

exports.APP_WEBPACK_PLUGINS_CONFIG_DIR = path.resolve(
  exports.MARVEL_ROOT_PATH,
  'webpack/plugins',
);

exports.APP_WEBPACK_LOADERS_CONFIG_DIR = path.resolve(
  exports.MARVEL_ROOT_PATH,
  'webpack/loaders',
);

exports.PROJECT_GIT_IGNORE_BAK = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.gitignore.bak',
);

exports.PROJECT_GIT_IGNORE = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.gitignore',
);

exports.PROJECT_ESLINT_RC_BAK = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.eslintrc.bak.js',
);

exports.PROJECT_ESLINT_RC = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.eslintrc.js',
);

exports.PROJECT_PRETTIER_RC_BAK = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.prettierrc.bak.js',
);

exports.PROJECT_PRETTIER_RC = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.prettierrc.js',
);

exports.PROJECT_STYLELINT_RC_BAK = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.stylelintrc.bak.js',
);

exports.PROJECT_STYLELINT_RC = path.resolve(
  exports.PROJECT_ROOT_PATH,
  '.stylelintrc.js',
);

exports.YARN_LOCK_FILE = path.resolve(exports.PROJECT_ROOT_PATH, 'yarn.lock');

exports.NPM_LOCK_FILE = path.resolve(
  exports.PROJECT_ROOT_PATH,
  'package-lock.json',
);
