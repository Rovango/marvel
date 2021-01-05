const cmpv = require('compare-versions');
const program = require('commander');
const { cmd, helper } = require('../utils');
const checkCliVersion = require('./checkCliVersion');
const { VERSION, MARVEL_CLI_NAME } = require('../constants');
const queryForceUpdate = require('./queryForceUpdate');

program
  .version(VERSION)
  .name('[npx] marvel update')
  .description(`${MARVEL_CLI_NAME} update helper`)
  .option('-f, --force', 'force update')
  .option('-s, --slient', 'check update sliently')
  .parse(process.argv);

const update = async () => {
  const {
    latest = '',
    useYarn = false,
    // forceUpdate = false,
  } = await checkCliVersion();

  const commanderStart = useYarn ? 'yarn add' : 'npm install';
  const commanderEnd = useYarn ? '-D' : '--save-dev';
  const commander = `${commanderStart} ${MARVEL_CLI_NAME} ${commanderEnd}`;

  if (!cmpv.validate(latest)) return;
  if (cmpv.compare(latest, VERSION, '<=')) {
    program.slient ||
      helper.printWithRectOutline(
        {
          [MARVEL_CLI_NAME]: 'cyan',
          [VERSION]: 'yellow',
          latest: 'green',
        },
        `${MARVEL_CLI_NAME} v${VERSION}`,
        'You already have the latest version',
      );
    return;
  }

  const logName = 'Changelog:';
  const logUrl =
    'https://git.bybit.com/fe/marvel-cli/-/blob/master/CHANGELOG.md';

  const info = `New version of ${MARVEL_CLI_NAME} available! ${VERSION} → ${latest}`;
  const changelog = `${logName} ${logUrl}`;
  const howToUpdate = `Run ${commander} to update!`;
  helper.printWithRectOutline(
    {
      [commanderStart]: 'green',
      [MARVEL_CLI_NAME]: 'cyan',
      [commanderEnd]: 'green',
      [VERSION]: 'red',
      [latest]: 'green',
      [logName]: 'yellow',
      [logUrl]: 'cyan',
    },
    info,
    changelog,
    howToUpdate,
  );

  if (program.force || (await queryForceUpdate()))
    return cmd.run(commander.split(' '));
};

update();
