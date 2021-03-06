process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const printHostingInstructions = require('../utils/printHostingInstructions');
const { PROJECT_TYPES } = require('../constants');
const appConfig = require('../config/app');

const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = FileSizeReporter;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
// if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
//   process.exit(1);
// }
if (
  PROJECT_TYPES.SPA === appConfig.type &&
  !checkRequiredFiles([paths.appHtml, paths.appIndexJs])
) {
  process.exit(1);
}
// 如果检测到多页应用，但没有必要文件，那么Warn and crash
if (
  PROJECT_TYPES.MPA === appConfig.type &&
  !checkRequiredFiles([
    paths.appHtml,
    ...paths.appMPAEntries.map((item) => item[1]),
  ])
) {
  process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// Generate configuration
let config = configFactory('production');

// add bundle analyzer
const analyzeBundle = argv.indexOf('--analyze-bundle') !== -1;
if (analyzeBundle) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `${paths.bundleAnalyzerPath}/report.html`,
      generateStatsFile: true,
      statsFilename: `${paths.bundleAnalyzerPath}/stats.json`,
      openAnalyzer: false,
    }),
  );
}

// add speed measure
const wrapSMP = argv.indexOf('--measure-speed') !== -1;
if (wrapSMP) {
  const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
  const smp = new SpeedMeasureWebpackPlugin({
    outputFormat: 'json',
    outputTarget: (output) =>
      fs.outputFileSync(`${paths.speedMeasurePath}/speed.json`, output),
  });
  config = smp.wrap(config);
}

checkBrowsers(paths.appPath, isInteractive)
  .then(() =>
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuild),
  )
  .then((previousFileSizes) => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          `\nSearch for the ${chalk.underline(
            chalk.yellow('keywords'),
          )} to learn more about each warning.`,
        );
        console.log(
          `To ignore, add ${chalk.cyan(
            '// eslint-disable-next-line',
          )} to the line before.\n`,
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE,
      );
      console.log();

      // eslint-disable-next-line import/no-dynamic-require
      const appPackage = require(paths.appPackageJson);
      const { publicUrl } = paths;
      const { publicPath } = config.output;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn,
      );

      console.log();
      console.log(
        chalk.yellow(
          'Tip: built files are meant to be served over an HTTP server.\n' +
            'Opening index.html over file:// probably not work.\n',
        ),
      );
      copyBuiltHtml();
      console.log();
    },
    (err) => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    },
  )
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log(chalk.cyan('Creating an optimized production build...'));

  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true }),
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n',
          ),
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };
      if (writeStatsJson) {
        return bfj
          .write(`${paths.appBuild}/bundle-stats.json`, stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch((error) => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}
function copyBuiltHtml() {
  if (!paths.appHtmlDest) {
    return;
  }
  fs.copySync(paths.appBuild, paths.appHtmlDest, {
    dereference: true,
    filter: (file) =>
      fs.lstatSync(file).isDirectory()
        ? file === paths.appBuild
        : /\.html$/.test(file),
  });
}
