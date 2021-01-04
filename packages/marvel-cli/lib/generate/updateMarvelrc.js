/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
const fse = require('fs-extra');
const chalk = require('chalk');
const { PROJECT_CONFIG_PATH, APP_CONFIG_FILE_NAME, RC, } = require('../constants');

function updateMarvelrc(name, platform) {
  delete require.cache[require.resolve(PROJECT_CONFIG_PATH)];
  const config = require(PROJECT_CONFIG_PATH);
  if (config[name] && config[name][platform]) {
    return console.log(
      `\n💡 configuration of ${chalk.cyan(name)}.${chalk.cyan(
        platform
      )} is already exists so that the ${chalk.cyan(
        APP_CONFIG_FILE_NAME
      )} wouldn't be updated automatically.`
    );
  }
  console.log(
    `\n💡 configuration of ${chalk.cyan(name)}.${chalk.cyan(
      platform
    )} is added automatically.`
  );
  let defaultConfig = `
    '${platform}': {${RC.MARVEL}
    },
    `;
  let content = fse.readFileSync(PROJECT_CONFIG_PATH, 'utf-8');
  let reg = null;
  if (config[name]) {
    reg = new RegExp(`(?<=['|"]?${name}['|"]?\\s*\\:\\s*\\{)([\\s\\n\\r]*)`);
  } else {
    defaultConfig = `,
  '${name}': {${defaultConfig.replace(/\s\s$/, '')}},
`;
    reg = /(?<=\}|\.\d+('|"))(,?\s*)(?=\};?[\s\r\n]*$)/;
  }
  content = content.replace(reg, defaultConfig);
  fse.writeFileSync(PROJECT_CONFIG_PATH, content);
  return 0;
}

module.exports = updateMarvelrc;
