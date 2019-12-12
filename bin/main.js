#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquire = require('inquirer');
const ora = require('ora');
const downloadGitRepo = require('download-git-repo');
const { folderExist, getFullPath, rmPath } = require('../utils/fs');
const { create } = require('../lib/project');

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

program.parse(process.argv);