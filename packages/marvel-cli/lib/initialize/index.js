/* eslint-disable */
const fse = require('fs-extra');
const copyApp = require('../generate/copyApp');
const glob = require('glob');
const chalk = require('chalk');
const path = require('path');
const ora = require('ora');
const { cmd } = require('../utils');
const {
  VERSION,
  MARVEL_CLI_NAME,
  PROJECT_ROOT_PATH,
  PROJECT_CONFIG_PATH,
  PROJECT_GIT_IGNORE,
  PROJECT_GIT_IGNORE_BAK,
  PROJECT_ESLINT_RC_BAK,
  PROJECT_ESLINT_RC,
  PROJECT_PRETTIER_RC_BAK,
  PROJECT_PRETTIER_RC,
  PROJECT_STYLELINT_RC_BAK,
  PROJECT_STYLELINT_RC,
  MARVEL_CLI_ROOT_PATH,
  APP_CONFIG_FILE_NAME,
  APP_NATIVE_CONFIG_FILE_NAME,
  BYBITIZENS_ROOT_PATH,
} = require('../constants');
const Inquire = require('./inquire');

function canInitilizeHere() {
  let allows = [
    'node_modules',
    'package\\.json',
    'yarn\\.lock',
    'package-lock\\.json',
    'yarn-error\\.log',
    'npm-debug\\.log',
    'README\\.md',
  ];
  let allowReg = new RegExp(`(${allows.join('|')})$`);
  const isEmpty =
    glob.sync(`${PROJECT_ROOT_PATH}/*`).filter((f) => !allowReg.test(f))
      .length == 0;

  if (!isEmpty) {
    console.log();
    console.log(
      chalk.yellow("    This Directory isn't empty, can not initialize here"),
    );
    return (
      console.log(chalk.yellow('    此目录并不是空目录，不能在此进行初始化')) ||
      false
    );
  }

  return true;
}

function initrc(demos) {
  const demorc = demos.reduce((prev, next) => prev + next.rc, '');
  const result = fse
    .readFileSync(PROJECT_CONFIG_PATH, 'utf-8')
    .replace('/**RCS_PLACEHOLDER**/', demorc)
    .replace('/**VERSION_PLACEHOLDER**/', VERSION);

  fse.writeFileSync(PROJECT_CONFIG_PATH, result);
}

function initNativerc(app) {
  fse.writeFileSync(
    path.resolve(BYBITIZENS_ROOT_PATH, app.name, APP_NATIVE_CONFIG_FILE_NAME),
    app.nativerc,
  );
}

async function copyTemplateFolder() {
  if (!canInitilizeHere()) {
    return;
  }
  const demos = await Inquire.queryDemos();
  const spinner = ora('initializing...').start();
  spinner.text = 'copying template...';
  fse.copySync(`${MARVEL_CLI_ROOT_PATH}/template`, PROJECT_ROOT_PATH, {
    dereference: true,
    filter: (file) => !/(node_modules|\.DS_Store)$/.test(file),
  });
  spinner.text = 'renaming backup files...';
  fse.moveSync(PROJECT_GIT_IGNORE_BAK, PROJECT_GIT_IGNORE, { overwrite: true });
  fse.moveSync(PROJECT_ESLINT_RC_BAK, PROJECT_ESLINT_RC, { overwrite: true });
  fse.moveSync(PROJECT_PRETTIER_RC_BAK, PROJECT_PRETTIER_RC, {
    overwrite: true,
  });
  fse.moveSync(PROJECT_STYLELINT_RC_BAK, PROJECT_STYLELINT_RC, {
    overwrite: true,
  });
  initrc(demos);

  let fns = demos.map((app) => () =>
    new Promise((resolve) => {
      setTimeout(() => {
        spinner.text = `generating ${chalk.cyan(app.name)} application...`;
        copyApp(app.name, app.platform, app.type);
        initNativerc(app);
        resolve();
      }, 250);
    }),
  );
  for (let fn of fns) fn && (await fn());
  spinner.stop();

  if (MARVEL_CLI_ROOT_PATH.startsWith(PROJECT_ROOT_PATH)) {
    // 如果是局部安装的cli，那么package.json可能被覆盖
    const useYarn = fse.existsSync(`${PROJECT_ROOT_PATH}/yarn.lock`);
    let commanders = (useYarn
      ? `yarn add ${MARVEL_CLI_NAME} -D`
      : `npm install ${MARVEL_CLI_NAME} --save-dev`
    ).split(' ');
    cmd.runSync(commanders);
  }

  console.log();
  console.log(
    `🎉 ${chalk.greenBright('Congratulations!')} Initialization of ${chalk.cyan(
      MARVEL_CLI_NAME,
    )} is successful.`,
  );
  if (demos.length === 0) {
    console.log();
    console.log(
      `🌈 Next, run ${chalk.yellow(
        'yarn && yarn generate',
      )} to create the first application.\n  Then run ${chalk.cyan(
        'yarn start',
      )} to start develop.`,
    );
    console.log();
    console.log(`🍔 ${chalk.yellow('Enjoy!')}`);
    return;
  }
  console.log(`
    There are ${
      demos.length
    } App demo help you to know how to develop with ${chalk.cyan(
    MARVEL_CLI_NAME,
  )}:
    ${demos
      .map(
        (app, index) => `${index + 1}. ${chalk.cyan(app.name)} (a ${
          app.type
        } on ${app.platform} platform) : ${chalk.cyan(
          `src/bybitizens/${app.name}`,
        )}
    `,
      )
      .join('')}
    `);
  console.log(
    `🌈 You can browse the default configuration of these apps in ${chalk.cyan(
      APP_CONFIG_FILE_NAME,
    )},\n or override that configuration by modifying ${chalk.cyan(
      APP_NATIVE_CONFIG_FILE_NAME,
    )}.\n All these paths mentioned above are relative to the project's root path:\n${chalk.cyan(
      `    ${PROJECT_ROOT_PATH}`,
    )}`,
  );
  console.log();
  console.log(
    `🎬 Just run "${chalk.cyan(
      'yarn && yarn start',
    )}" then select an application you are interested in to start your Development journey with ${chalk.cyan(
      '@bybit/marvel-cli',
    )}.`,
  );
  console.log();
  console.log(`🍔 ${chalk.yellow('Enjoy!')}`);
}

copyTemplateFolder();
