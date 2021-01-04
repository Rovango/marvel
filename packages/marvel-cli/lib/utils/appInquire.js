/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const inquirer = require('inquirer');
const {
  PROJECT_ROOT_PATH,
  BYBITIZENS_ROOT_PATH,
  CHOICES,
} = require('../constants');

const detectProjects = () => {
  const pList = glob
    .sync(path.join(PROJECT_ROOT_PATH, 'src/bybitizens/*'))
    .filter((item) => !/src\/bybitizens\/common$/.test(item));
  return pList.map((pname) => {
    const name = pname.split('/').slice(-1)[0];
    return {
      name,
      value: name,
    };
  });
};
const detectPlatform = (business) =>
  CHOICES.PLATFORM.filter((c) => {
    const exists = fs.existsSync(
      `${BYBITIZENS_ROOT_PATH}/${business}/${c.value}`,
    );
    return exists
      ? glob.sync(`${BYBITIZENS_ROOT_PATH}/${business}/${c.value}/*`).length > 0
      : exists;
  });

class AppInquire {
  constructor(program) {
    this.program = program;
  }

  async queryBusiness() {
    if (this.program.business) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );

    const { business } = await inquirer
      .prompt({
        name: 'business',
        type: 'list',
        pageSize: 99,
        choices: detectProjects(),
        message: 'Please select your app name',
      })
      .then((answer) => answer);

    return business;
  }

  async queryPlatform(choices) {
    if (this.program.platform) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
    const { platform } = await inquirer
      .prompt({
        name: 'platform',
        type: 'list',
        choices,
        validate: (answer) => !(answer.length === 0),
        message: 'Please select your app platform',
      })
      .then((answer) => ({ platform: 'desktop', ...answer }));
    return platform;
  }

  async inquire(cb) {
    // 获取app名称
    let { business } = this.program;
    if (!business) {
      business = await this.queryBusiness();
    }
    // 获取构建平台
    let { platform } = this.program;
    if (!platform) {
      const choices = detectPlatform(business);
      if (choices.length === 0) {
        console.log(
          `您选择的 ${chalk.cyan(business)} 为${chalk.red(
            '空应用',
          )}，${chalk.yellow('无法执行相关操作')}`,
        );
        throw new Error(`${chalk.red('Empty application')}`);
      }
      platform =
        choices.length === 1
          ? choices[0].value
          : await this.queryPlatform(choices);
    }
    // 执行
    cb && cb({ business, platform });
  }
}

module.exports = AppInquire;
