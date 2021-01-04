const koaRouter = require('koa-router');
const { getSlogan } = require('../httpUtils');

const apiRoutes = (mockPort) => {
  const router = koaRouter();
  router.get('/mock-port', (ctx) => {
    ctx.response.body = {
      port: mockPort,
    };
  });
  router.get('/slogan', (ctx) => {
    ctx.response.body = {
      slogan: getSlogan(),
    };
  });
  return router.routes();
};

module.exports = apiRoutes;
