const execa = require('execa');
const path = require('path');

module.exports = {
    async register(name, cmd) {
        // 如果指定了文件路径
        if (cmd.path) {

        } else {
            let configs = require('@sdx/utils/gateway/config');
            configs = configs.filter(cfg => {
                if (name.length > 0) {
                    return name.find(arg => cfg.functionName.startsWith(arg));
                } else {
                    return true;
                }
            });
            configs.forEach(config => {
                console.log(__dirname);
                let filePath = `${path.resolve(__dirname, '../node_modules/@sdx/utils/gateway', config.filePath)}`;
                console.log(filePath);
                execa.commandSync(`./register-tool register ${config.functionName} ${filePath} ${config.apiId} ${config.method}`, {
                    cwd: path.resolve(__dirname, '../')
                });
            })
        }
    }
};