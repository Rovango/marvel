exports.headers = (req) => ({
  'access-allow-origin': '*',
  'test-header': req.query.header || '1',
});

exports.response = (req, WSPool) => ({
  success: true,
  message: 'OK',
  statusCode: 200,
  data: {
    url: req.path,
    query: req.query,
    isLogin: true,
    uid: '123456',
    marvelList: [
      { id: 0, name: 'Black Panther' },
      { id: 1, name: 'iron-man' },
      { id: 2, name: 'ant-man' },
      { id: 3, name: 'spider-man' },
      { id: 4, name: 'black-widow' },
      { id: 5, name: 'Captain America' },
      { id: 6, name: 'Hulk' },
      { id: 7, name: 'Captain Marvel' },
      { id: 8, name: 'Loki' },
      { id: 9, name: 'Thor' },
    ],
  },
});
