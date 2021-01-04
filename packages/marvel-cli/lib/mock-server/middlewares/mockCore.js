const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Mock = require('mockjs');
const dayjs = require('dayjs');
const validator = require('validator');
const { sleep, isFunction, helper } = require('../../utils');
const httpUtils = require('../httpUtils');
const { PROJECT_ROOT_PATH } = require('../../constants');

const sendResponse = (ctx, data) => {
  const resp = Mock.mock(data);
  ctx.response.body = JSON.stringify(resp);
};
const validateRequest = (verifier, ctx, WSPool) => {
  try {
    const validate = (fn) => (isFunction(fn) ? fn(validator) : true);
    const { header, method, query, body, success, fail, complete } =
      verifier || {};
    const result = Boolean(
      validate(method) && validate(header) && validate(query) && validate(body),
    );
    if (result) {
      isFunction(success) && success(ctx.request, WSPool);
      isFunction(complete) && complete(ctx.request, WSPool);
    } else {
      const failData = isFunction(fail) ? fail(ctx.request, WSPool) : fail;
      isFunction(complete) && complete(ctx.request, WSPool);
      sendResponse(ctx, helper.basicErrorData(failData));
    }
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
    }
    let data = {};
    try {
      data = isFunction(verifier.fail)
        ? verifier.fail(ctx, WSPool, err)
        : verifier.fail;
    } catch (e) {
      data = { ret_msg: e.message };
      console.log(e);
    }

    sendResponse(ctx, helper.basicErrorData(data));
    return false;
  }
};
const mockCore = ({ project, platform, WSPool, ignore }) => {
  return async (ctx, next) => {
    const pathUrl = ctx.request.path;
    if (ignore.some((reg) => reg.test(pathUrl))) {
      return next();
    }
    const mockpath = path.resolve(
      PROJECT_ROOT_PATH,
      `src/bybitizens/${project}/__mocks__/http/${platform}${pathUrl}.js`,
    );
    const fileExists = fs.existsSync(mockpath);
    console.log(
      `[${dayjs().format('HH:mm:ss.SSS')}] ${chalk[fileExists ? 'blue' : 'red'](
        ctx.request.method,
      )} ${chalk.cyan(pathUrl)}${
        ctx.querystring
          ? `?${ctx.querystring}`
              .replace(/(?<==)([^=&]*)(?=&|$)/g, chalk.green('$1'))
              .replace(/(\?|=|&)/g, chalk.yellow('$1'))
          : ''
      }`,
      ctx.request.body,
    );

    const resolveValue = (origin, defaultValue) =>
      typeof origin === 'function'
        ? origin(ctx.request, WSPool)
        : origin || defaultValue;
    if (fileExists) {
      ctx.request.marvelHttpUtils = {
        getTrigger: httpUtils.triggerObtainer(project, platform),
      };
      delete require.cache[require.resolve(mockpath)];
      // eslint-disable-next-line import/no-dynamic-require
      const mock = require(mockpath);
      const { headers, response, respStatus, delay, verification } = mock;

      // 接口延时返回
      const delayTime = resolveValue(delay, 0);
      delayTime && (await sleep(delayTime));

      // 处理响应状态码
      if (respStatus) {
        let status = resolveValue(respStatus, 200);
        if (typeof status === 'object') {
          status =
            status[ctx.request.method.toLowerCase()] ||
            status[ctx.request.method.toUpperCase()];
        }
        ctx.status = Number(status);
      }
      // 处理响应头
      ctx.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': ctx.request.header.origin,
        // 非OPTION请求中header无'access-control-request-headers'字段
        'Access-Control-Allow-Headers':
          ctx.request.header['access-control-request-headers'] ||
          'Content-Type,platform,UserToken,X-Client-Tag',
        ...Mock.mock(resolveValue(headers, {})),
      });

      if (ctx.request.method === 'OPTIONS') {
        ctx.response.body = '';
        return;
      }

      // 接口request验证
      if (!validateRequest(resolveValue(verification, {}), ctx, WSPool)) {
        return;
      }

      // 处理响应体
      sendResponse(ctx, resolveValue(response, mock || {}));
    } else {
      await next();
    }
  };
};

module.exports = mockCore;
