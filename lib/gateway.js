const execa = require('execa');
const chalk = require('chalk');
const path = require('path');

let configs = require('@sdx/utils/gateway/config');
const { folderExist, getFullPath } = require('../utils/fs');

module.exports = {
    async register(name, cmd) {
        // 如果指定了文件路径
        if (cmd.path) {

        } else {
            configs = configs.filter(cfg => {
                if (name.length > 0) {
                    return name.find(arg => cfg.functionName.startsWith(arg));
                } else {
                    return true;
                }
            });
            configs.forEach(config => {
                let filePath = `${path.resolve(__dirname, '../node_modules/@sdx/utils/gateway', config.filePath)}`;
                console.log(filePath);
                const result = execa.commandSync(`./register-tool register ${config.functionName} ${filePath} ${config.apiId} ${config.method}`, {
                    cwd: path.resolve(__dirname, '../')
                });
                if (result.failed) {
                    console.log(chalk.red('接口注册失败失败：' + result.command));
                } else {
                    console.log(chalk.green('接口注册失败成功：' + result.command));
                }
            });
        }
    },

    async unregister({name, apiId}) {
        console.log(name);
        console.log(apiId);
        if (name.length === 0 || apiId.length === 0) {
            // 删除所有未注册的接口
            if (folderExist('config.js')) {
                configs = require(getFullPath('config.js'));
            }
            console.log(configs);
            configs.forEach(config => {
                const result = execa.commandSync(`./register-tool unregister ${config.apiId}`, {
                    cwd: path.resolve(__dirname, '../')
                });
                if (result.failed) {
                    console.log(chalk.red('删除聚合接口失败：' + result.command));
                } else {
                    console.log(chalk.green('删除聚合接口成功：' + result.command));
                }
            });
        } else {
            [...name, ...apiId]
                .map(item => item.replace(/_/g), '/')
                .forEach(item => {
                    const result = execa.commandSync(`./register-tool unregister ${item}`, {
                        cwd: path.resolve(__dirname, '../')
                    });
                    if (result.failed) {
                        console.log(chalk.red('删除聚合接口失败：' + result.command));
                    } else {
                        console.log(chalk.green('删除聚合接口成功：' + result.command));
                    }
                });
        }
    }
};