const { RC, PROJECT_TYPES, PLATFORM_TYPES } = require('../constants');

function another(platform) {
  return platform === PLATFORM_TYPES.MOBILE
    ? PLATFORM_TYPES.DESKTOP
    : PLATFORM_TYPES.MOBILE;
}

module.exports = [
  {
    name: 'hulk',
    platform: PLATFORM_TYPES.MOBILE,
    type: PROJECT_TYPES.SPA,
  },
  {
    name: 'iron-man',
    platform: PLATFORM_TYPES.DESKTOP,
    type: PROJECT_TYPES.SPA,
  },
  {
    name: 'spider-man',
    platform: PLATFORM_TYPES.DESKTOP,
    type: PROJECT_TYPES.MPA,
  },
  {
    name: 'wolverine',
    platform: PLATFORM_TYPES.MOBILE,
    type: PROJECT_TYPES.MPA,
  },
].map((app) => {
  return {
    ...app,
    rc: `\n  '${app.name}': {
    ${app.platform}: {${RC.MARVEL}
    },
  },\n`,
    nativerc: `module.exports = {
  ${app.platform}: {${RC.NATIVE}
  },
  ${another(app.platform)}: {},
};\n`
  };
});
