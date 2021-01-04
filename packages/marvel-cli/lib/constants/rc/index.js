exports.MARVEL = `
      buildDest: '', // build后资源定制输出 path
      htmlDest: '', // html定制输出 path, 如果不需要向额外的目录输出buid后的html文件，此项留空即可
      publicPath: '/', // 静态资源公共地址(构建用)
      templateRoot: '@/public', // 定制index.html以及public资源所在文件夹
      proxy: {
        mock: {}, // 本地mock环境
        test: {}, // 测试环境
        dev: {}, // 联调环境
      },
      active: 'mock', // 被激活的proxy环境
      https: false, // 是否开启https`;

exports.NATIVE = `
      buildDest: '', // build后资源定制输出 path
      htmlDest: '', // html定制输出 path, 如果不需要向额外的目录输出buid后的html文件，此项留空即可
      publicPath: '/', // 静态资源公共地址(构建用)
      // devServer 监听端口, 可在.marvelrc-native.js中进行覆盖定制
      port: 8002,
      // mockServer 监听端口, 可在.marvelrc-native.js中进行覆盖定制
      mockPort: 8001,
      proxy: {
        mock: { // mock环境proxy规则，可在.marvelrc-native.js中进行覆盖定制
          '/api': 'http://localhost:8001',
          '/wsapi': {
            target: 'http://localhost:8001',
            ws: true,
          },
        }, // 本地mock环境
        test: {}, // 测试环境
        dev: {}, // 联调环境
      },
      active: 'mock', // 被激活的proxy环境
      https: false, // 是否开启https`;
