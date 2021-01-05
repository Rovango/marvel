/* eslint-disable no-console */
const inquirer = require('inquirer');
const path = require('path');

class ParamsInquire {
  constructor(program) {
    this.program = program;
  }

  async queryPort() {
    if (this.program.port) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );

    const { port } = await inquirer
      .prompt({
        name: 'port',
        type: 'input',
        default: 8000,
        message: 'Port to be listened',
      })
      .then((answer) => answer);

    return port;
  }

  async queryHttpRoot() {
    if (this.program.httpRoot) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
    const { httpRoot } = await inquirer
      .prompt({
        name: 'httpRoot',
        type: 'input',
        validate: (answer) => {
          if (answer.length === 0) {
            return '根路径不能为空';
          }
          if (!path.isAbsolute(answer)) {
            return '根路径必须是绝对路径';
          }
          return true;
        },
        message: 'HTTP root path',
      })
      .then((answer) => answer);

    return httpRoot;
  }

  async queryWebSocketRoot() {
    if (this.program.wsRoot) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
    const { wsRoot } = await inquirer
      .prompt({
        name: 'wsRoot',
        type: 'input',
        validate: (answer) => {
          if (answer.length === 0) {
            return '根路径不能为空';
          }
          if (!path.isAbsolute(answer)) {
            return '根路径必须是绝对路径';
          }
          return true;
        },
        message: 'WebSocket root path',
      })
      .then((answer) => answer);

    return wsRoot;
  }

  async inquire(cb) {
    // 获取监听端口
    let { port } = this.program;
    if (!port) {
      port = await this.queryPort();
    }
    // 获取根目录
    let { httpRoot } = this.program;
    if (!httpRoot) {
      httpRoot = await this.queryHttpRoot();
    }
    let { wsRoot } = this.program;
    if (!wsRoot) {
      wsRoot = await this.queryWebSocketRoot();
    }
    // 执行
    cb && cb({port, httpRoot, wsRoot });
  }
}

module.exports = ParamsInquire;
