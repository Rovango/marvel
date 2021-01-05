const inquirer = require('inquirer');

class PathInquire {
  constructor(program) {
    this.program = program;
  }

  async queryCertPath() {
    if (this.program.certPath) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );

    const { certPath } = await inquirer
      .prompt({
        name: 'certPath',
        type: 'input',
        validate: (answer) => {
          if (answer.length === 0) {
            return '路径不能为空';
          }
          return true;
        },
        message: 'Where to emit the cert file?',
      })
      .then((answer) => answer);

    return certPath;
  }

  async queryKeyPath() {
    if (this.program.keyPath) return;

    inquirer.registerPrompt(
      'autocomplete',
      require('inquirer-autocomplete-prompt'),
    );
    const { keyPath } = await inquirer
      .prompt({
        name: 'keyPath',
        type: 'input',
        validate: (answer) => {
          if (answer.length === 0) {
            return '路径不能为空';
          }
          return true;
        },
        message: 'Where to emit the key file?',
      })
      .then((answer) => answer);

    return keyPath;
  }

  async inquire(cb) {
    // 获取 certPath
    let { certPath } = this.program;
    if (!certPath) {
      certPath = await this.queryCertPath();
    }
    // 获取 keyPath
    let { keyPath } = this.program;
    if (!keyPath) {
      keyPath = await this.queryKeyPath();
    }
    // 执行
    cb && cb({ certPath, keyPath });
  }
}

module.exports = PathInquire;
