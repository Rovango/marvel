const url = require('url');

function evaluateRewriteRule(parsedUrl, match, rule, req) {
  if (typeof rule === 'string') {
    return rule;
  }
  if (typeof rule !== 'function') {
    throw new Error('Rewrite rule can only be of type string or function.');
  }

  return rule({
    parsedUrl,
    match,
    request: req,
  });
}

function acceptsHtml(header, options) {
  options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*'];
  for (let i = 0; i < options.htmlAcceptHeaders.length; i += 1) {
    if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function getLogger(options) {
  if (options && options.logger) {
    return options.logger;
  }
  if (options && options.verbose) {
    return console.log.bind(console);
  }
  return () => {};
}

module.exports = function historyApiFallback(opts) {
  const options = opts || {};
  const logger = getLogger(options);

  return (req, next) => {
    const { headers } = req;
    if (req.method !== 'GET') {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the method is not GET.',
      );
      return next();
    }
    if (!headers || typeof headers.accept !== 'string') {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client did not send an HTTP accept header.',
      );
      return next();
    }
    if (headers.accept.indexOf('application/json') === 0) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client prefers JSON.',
      );
      return next();
    }
    if (!acceptsHtml(headers.accept, options)) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the client does not accept HTML.',
      );
      return next();
    }

    const parsedUrl = url.parse(req.url);
    let rewriteTarget;
    options.rewrites = options.rewrites || [];
    for (let i = 0; i < options.rewrites.length; i += 1) {
      const rewrite = options.rewrites[i];
      const match = parsedUrl.pathname.match(rewrite.from);
      if (match !== null) {
        rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to, req);

        if (rewriteTarget.charAt(0) !== '/') {
          logger(
            'We recommend using an absolute path for the rewrite target.',
            'Received a non-absolute rewrite target',
            rewriteTarget,
            'for URL',
            req.url,
          );
        }

        logger('Rewriting', req.method, req.url, 'to', rewriteTarget);
        req.url = rewriteTarget;
        return next();
      }
    }

    const { pathname } = parsedUrl;
    if (
      pathname.lastIndexOf('.') > pathname.lastIndexOf('/') &&
      options.disableDotRule !== true
    ) {
      logger(
        'Not rewriting',
        req.method,
        req.url,
        'because the path includes a dot (.) character.',
      );
      return next();
    }

    rewriteTarget = options.index || '/index.html';
    logger('Rewriting', req.method, req.url, 'to', rewriteTarget);
    req.url = rewriteTarget;
    next();
  };
};
