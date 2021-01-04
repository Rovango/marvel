exports.headers = (req) => ({
  'access-allow-origin': '*',
  'test-header': req.query.header || '1',
});

exports.response = (req) => ({
  success: true,
  message: 'OK',
  statusCode: 200,
  data: {
    url: req.path,
    query: req.query,
    isLogin: true,
    uid: '123456',
  },
});
