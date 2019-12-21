#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquire = require('inquirer');
const ora = require('ora');
const downloadGitRepo = require('download-git-repo');
const { folderExist, getFullPath, rmPath } = require('../utils/fs');
const { create } = require('../lib/project');
const { register, unregister } = require('../lib/gateway');
const { componentScaffold } = require('../lib/component');

const pack = require('../package');

console.log(chalk.blue.bold(`sd-cli v${pack.version}`));

program
    .version(pack.version)
    .usage('<command> [options]')
;

program
    .command('create <name>')
    .description('创建新项目')
    .option('-f --force', '覆盖已存在文件夹', false)
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
    .command('unregister [name...]')
    .description('删除已注册的聚合接口, name为函数名或者API_ID,格式如login（name）或/fe-compose/api/v1/login（apiID）或_fe-compose_api_v1_login（apiID）')
    .option('-p --path <path>', '聚合接口脚本位置')
    .action(function (name, cmd) {
        unregister(name, cmd);
    });

program
    .command('component <name>')
    .description('快速创建组件目录结构，初始化部分代码')
    .option('-p --package <name>', '组件所属包名')
    .option('-f --force', '覆盖原组件', false)
    .action(function(name, cmd) {
        componentScaffold(name, cmd);
    });

program.parse(process.argv);