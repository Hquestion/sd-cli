const execa = require('execa');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const configs = require('@sdx/utils/gateway/config');

module.exports = {
    async register(name, cmd) {
        let registerConfig = configs,
            scriptPath = path.resolve(__dirname, '../node_modules/@sdx/utils/gateway');
        // 如果指定了文件路径
        if (cmd.path) {
            let cmdPath = path.resolve(process.cwd(), cmd.path);
            let cfgPath = path.resolve(cmdPath, 'config.js');
            // 判断当前路径下是否存在config.js，不存在则报错，退出命令行
            if (fs.existsSync(cfgPath)) {
                console.log(chalk.yellow(`使用${cmdPath}下的脚本进行注册，请确保脚本位置正确！`));
                scriptPath = cmdPath;
                registerConfig = require(cfgPath);
            } else {
                throw new Error('当前路径不存在\'config.js\'文件，请检查聚合脚本！');
            }
        }
        registerConfig = registerConfig.filter(cfg => {
            if (name.length > 0) {
                return name.find(arg => cfg.functionName.startsWith(arg));
            } else {
                return true;
            }
        });
        registerConfig.forEach(config => {
            let filePath = `${path.resolve(scriptPath, config.filePath)}`;
            const result = execa.commandSync(`./register-tool register ${config.functionName} ${filePath} ${config.apiId} ${config.method}`, {
                cwd: path.resolve(__dirname, '../')
            });
            if (result.failed) {
                console.log(chalk.red('接口注册失败：' + result.command));
                console.log('\n');
                console.log(chalk.red(result.stderr));
            } else {
                console.log(chalk.green('接口注册成功：' + result.command));
            }
        });
    },

    async unregister(name, cmd) {
        let unregisterConfig = configs;
        if (cmd.path) {
            let cmdPath = path.resolve(process.cwd(), cmd.path);
            let cfgPath = path.resolve(cmdPath, 'config.js');
            if (fs.existsSync(cfgPath)) {
                console.log(chalk.yellow(`使用${cmdPath}下的脚本进行注册，请确保脚本位置正确！`));
                unregisterConfig = require(cfgPath);
            } else {
                throw new Error('当前路径不存在\'config.js\'文件，请检查聚合脚本！');
            }
        }
        if (name.length === 0) {
            // 删除所有未注册的接口
            unregisterConfig.forEach(config => {
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
            name
                .map(item => {
                    if (item.indexOf('/') < 0 && item.indexOf('_') < 0) {
                        const api = unregisterConfig.find(cfg => {
                            return cfg.functionName.startsWith(item);
                        });
                        return api && api.apiId;
                    } else {
                        return item.replace(/_/g, '/')
                    }
                })
                .filter(item => !!item)
                .forEach(item => {
                    const result = execa.commandSync(`./register-tool unregister ${item}`, {
                        cwd: path.resolve(__dirname, '../')
                    });
                    if (result.failed) {
                        console.log(chalk.red('删除聚合接口失败：' + result.command));
                        console.log('\n');
                        console.log(chalk.red(result.stderr));
                    } else {
                        console.log(chalk.green('删除聚合接口成功：' + result.command));
                    }
                });
        }
    }
};