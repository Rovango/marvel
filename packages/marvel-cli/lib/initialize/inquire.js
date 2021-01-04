const chalk = require('chalk');
const inquirer = require('inquirer');

class Inquire {
  constructor() {
    this.demos = [];
  }

  static async queryDemos(cb) {
    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
    const demos = require('./demos');
    const choices = demos.map((app, index) => {
      return {
        name: `${index + 1}. ${chalk.cyan(app.name)} (a ${app.type} on ${
          app.platform
        } platform)`,
        value: app,
      };
    });

    const { demos: selected } = await inquirer
      .prompt({
        name: 'demos',
        type: 'checkbox',
        pageSize: 10,
        choices,
        message: 'Please select one or more demo(s) you need',
      })
      .then((answer) => answer);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    cb && cb(selected);
    return selected;
  }
}

module.exports = Inquire;
