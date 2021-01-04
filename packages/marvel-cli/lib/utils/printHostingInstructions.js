/**
 * Copyright (c) 2020-present, Bybit.com, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const chalk = require('chalk');
const globalModules = require('global-modules');
const fs = require('fs');

function printHostingInstructions(
  appPackage,
  publicUrl,
  publicPath,
  buildFolder,
  useYarn,
) {
  if (publicPath !== '/') {
    // "http://bybit.com/project/platform"
    printBaseMessage(buildFolder, publicPath);
  } else {
    // "homepage": "http://mywebsite.com"
    //   or no homepage
    printBaseMessage(buildFolder, publicUrl);

    printStaticServerInstructions(buildFolder, useYarn);
  }
}

function printBaseMessage(buildFolder, hostingLocation) {
  console.log(
    `The project was built assuming it is hosted at ${chalk.green(
      hostingLocation || 'the server root',
    )}.`,
  );
  console.log(
    `You can control this with the ${chalk.green(
      'publicPath',
    )} field in your ${chalk.cyan('.marvelrc.js')}.`,
  );

  console.log();
  console.log(`The ${chalk.cyan(buildFolder)} folder is ready to be deployed.`);
}

function printStaticServerInstructions(buildFolder, useYarn) {
  console.log('You may serve it with a static server:');
  console.log();

  if (!fs.existsSync(`${globalModules}/serve`)) {
    if (useYarn) {
      console.log(`  ${chalk.cyan('yarn')} global add serve`);
    } else {
      console.log(`  ${chalk.cyan('npm')} install -g serve`);
    }
  }
  console.log(`  ${chalk.cyan('serve')} -s ${buildFolder}`);
}

module.exports = printHostingInstructions;
