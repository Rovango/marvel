const inquirer = require('inquirer');

module.exports = async () => {
  inquirer.registerPrompt(
    'autocomplete',
    require('inquirer-autocomplete-prompt'),
  );

  const { forceUpdate } = await inquirer
    .prompt({
      name: 'forceUpdate',
      type: 'comfirm',
      message: '是否立刻升级？Update immediately? [y/N]',
      default: 'yes',
    })
    .then((answer) => answer);

  return ['yes', 'y'].includes(String(forceUpdate).toLowerCase());
};
