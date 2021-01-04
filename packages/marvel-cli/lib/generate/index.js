/* eslint-disable no-console */
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fse = require('fs-extra');
const {
  VERSION,
  CHOICES,
  BYBITIZENS_ROOT_PATH,
  PROJECT_CONFIG_PATH,
  PROJECT_ROOT_PATH,
  APP_CONFIG_FILE_NAME,
  APP_NATIVE_CONFIG_FILE_NAME,
} = require('../constants');
const copyApp = require('./copyApp');
const updateMarvelrc = require('./updateMarvelrc');
const updateNativerc = require('./updateNativerc');
const { dirNotEmptyExists } = require('../utils');

program
  .version(VERSION)
  .name('[npx] marvel generate')
  .description('Automatically create new application')
  .option('-b, --business <business>', 'application name')
  .option('-p, --platform <mobile|desktop>', 'application platform')
  .option('-t, --type <spa|mpa>', 'application type')
  .option('-s, --slient', 'slient or not')
  .parse(process.argv);

const queryBusiness = async () => {
  const { business } = await inquirer
    .prompt({
      name: 'business',
      type: 'input',
      message: 'Please input your application name',
      validate: (business) => {
        const reg = /^[a-zA-Z][\w-]*\w$/;
        if (!reg.test(business)) {
          return `Name is invalid, rule：${chalk.cyan(reg.toString())}`;
        }

        const exists =
          business &&
          dirNotEmptyExists(`${BYBITIZENS_ROOT_PATH}/${business}`) &&
          CHOICES.PLATFORM.every((platform) =>
            dirNotEmptyExists(
              `${BYBITIZENS_ROOT_PATH}/${business}/${platform.value}`,
            ),
          );

        if (exists) {
          return `App named ${chalk.cyan(
            business,
          )} is already exists with all posibile platform choices.`;
        }

        return true;
      },
    })
    .then((answer) => answer);
  return business;
};

const queryPlatform = async (business) => {
  const alreadyExistPlatforms = [];
  const choices = CHOICES.PLATFORM.filter((platform) => {
    const exists = dirNotEmptyExists(
      `${BYBITIZENS_ROOT_PATH}/${business}/${platform.value}`,
    );
    if (exists) {
      alreadyExistPlatforms.push(platform.value);
      return false;
    }
    return true;
  });
  if (alreadyExistPlatforms.length > 0) {
    console.log(
      `${chalk.yellow('>>')} platform named "${chalk.cyan(
        alreadyExistPlatforms.join(),
      )}" of ${chalk.cyan(
        business,
      )} app is already exists so that only ${chalk.cyan(
        choices.length,
      )} choice ( ${chalk.cyan(
        choices.map((c) => c.value).join(' & '),
      )} ) could be selected.`,
    );
  }
  const { platform } = await inquirer
    .prompt({
      name: 'platform',
      type: 'list',
      choices,
      message: 'Please select app platform',
      validate: (platform) => {
        const exists = dirNotEmptyExists(
          `${BYBITIZENS_ROOT_PATH}/${business}/${platform}`,
        );
        if (exists) {
          console.log(
            chalk.red(
              `  App named "${chalk.yellow(business)}" of ${chalk.yellow(
                platform,
              )} platform is already exists.`,
            ),
          );
        }

        return !exists;
      },
    })
    .then((answer) => answer);
  return platform;
};

const queryType = async () => {
  const { type } = await inquirer
    .prompt({
      name: 'type',
      type: 'list',
      choices: CHOICES.DEPOLY_TYPE,
      message: 'Please select app deploy type',
    })
    .then((answer) => answer);
  return type;
};

const enquire = async () => {
  if (
    !fse.existsSync(BYBITIZENS_ROOT_PATH) ||
    !fse.existsSync(PROJECT_CONFIG_PATH)
  ) {
    return console.log(
      chalk.red(
        `    This folder/project is probably not initialized by @bybit/marvel-cli,
        marvel cannot create app here.
        Please check and try again.`,
      ),
    );
  }

  let { business, platform, type } = program;
  const { slient } = program;
  business = business || (await queryBusiness());
  platform = platform || (await queryPlatform(business));
  type = type || (await queryType());

  copyApp(business, platform, type);
  updateMarvelrc(business, platform);
  updateNativerc(business, platform);

  if (slient) return 0;

  console.log();
  console.log(
    `🌈 You can browse the default configuration in ${chalk.cyan(
      APP_CONFIG_FILE_NAME,
    )},\n or override that configuration by modifying ${chalk.cyan(
      APP_NATIVE_CONFIG_FILE_NAME,
    )}.\n All these paths mentioned above are relative to the project's root path:\n${chalk.cyan(
      `    ${PROJECT_ROOT_PATH}`,
    )}`,
  );
  console.log();
  console.log(
    `🎉 ${chalk.greenBright('Congratulations!')} An ${chalk.cyan(
      type,
    )} application of ${chalk.cyan(platform)} platform and named ${chalk.cyan(
      business,
    )} has been generated successfully in\n${chalk.cyan(
      `    src/bybitizens/${business}/${platform}`,
    )}.`,
  );
  console.log();
  const useYarn = fse.existsSync(`${PROJECT_ROOT_PATH}/yarn.lock`);
  console.log(
    `🔥 If you wanna start developing this application immediately. Try this: ${chalk.cyan(
      useYarn ? 'yarn start' : 'npm run start',
    )}`,
  );
  return console.log();
};

enquire();
