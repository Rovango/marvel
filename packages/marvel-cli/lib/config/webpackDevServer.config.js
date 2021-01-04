const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const paths = require('./paths');
const httpsConfig = require('./httpsConfig');
const appConfig = require('./app');
const { PROJECT_TYPES } = require('../constants');

const enableHttps = appConfig.https || process.env.HTTPS === 'true';
const host = process.env.HOST || '0.0.0.0';
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/sockjs-node'
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  return {
    disableHostCheck:
      !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true, // 开启gzip
    // WebpackDevServer自身的日志通常没啥用，所以关了
    // 但编译的warnings和errors还是会输出
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    // 不开启的话，contentBase的文件变化默认不会触发页面reload
    watchContentBase: true,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    transportMode: 'ws',
    // Prevent a WS client from getting injected as we're already including
    // `webpackHotDevClient`.
    injectClient: false,
    // Enable custom sockjs pathname for websocket connection to hot reloading server.
    // Enable custom sockjs hostname, pathname and port for websocket connection
    // to hot reloading server.
    sockHost,
    sockPath,
    sockPort,
    // 开启热更新
    hot: true,
    publicPath: '/',
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    quiet: true,
    // 防止在某些系统上CPU过载: https://github.com/facebook/create-react-app/issues/293
    // 但src/node_modules不会被忽略以支持绝对路径的imports:
    // https://github.com/facebook/create-react-app/issues/1065
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    https: enableHttps && httpsConfig(),
    host,
    overlay: false,
    historyApiFallback:
      PROJECT_TYPES.SPA === appConfig.type
        ? {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebook/create-react-app/issues/387.
            disableDotRule: true,
          }
        : false,
    public: allowedHost,
    proxy,
    stats: 'errors-only',
    before(app, server) {
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware(paths.publicUrl));
    },
  };
};
