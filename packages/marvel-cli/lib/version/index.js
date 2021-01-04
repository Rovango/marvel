const { VERSION, MARVEL_CLI_NAME } = require('../constants');
const { helper } = require('../utils');

helper.printWithRectOutline(
  {
    [MARVEL_CLI_NAME]: 'cyan',
    [VERSION]: 'yellow',
  },
  `${MARVEL_CLI_NAME} v${VERSION} has been installed`,
);
