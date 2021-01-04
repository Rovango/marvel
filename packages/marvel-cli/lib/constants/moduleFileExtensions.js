// 用同webpack一样的顺序解析文件路径
const MODULE_FILE_EXTENSIONS = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

module.exports = MODULE_FILE_EXTENSIONS;
