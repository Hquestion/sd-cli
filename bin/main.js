#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquire = require('inquirer');
const ora = require('ora');
const downloadGitRepo = require('download-git-repo');
const { folderExist, getFullPath, rmPath } = require('../utils/fs');
const { create } = require('../lib/project');
const { register, unregister } = require('../lib/gateway');

const pack = require('../package');

console.log(chalk.blue.bold(`sd-cli v${pack.version}`));

program
    .version(pack.version)
    .usage('<command> [options]')
;

program
    .command('create <name>')
    .description('创建新项目')
    .option('-f --force', '覆盖已存在文件夹')
    .option('-t --template <url>', '自定义项目模板')
    .action(function(name, cmd) {
        create(name, cmd);
    });

program
    .command('register [name...]')
    .description('注册聚合接口')
    .option('-p --path <path>', '聚合接口脚本位置')
    .action(function(name, cmd) {
        register(name, cmd);
    });

program
    .command('unregister')
    .description('删除已注册的聚合接口')
    .option('-n --name <name...>', '聚合接口函数名')
    .option('-id --api-id <id...>', '聚合接口API_ID，如/fe-compose/api/v1/login或_fe-compose_api_v1_login')
    .action((cmd) => {
        unregister({name, apiId} = cmd);
    });

program.parse(process.argv);