#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const inquire = require('inquirer');
const ora = require('ora');
const downloadGitRepo = require('download-git-repo');
const { folderExist, getFullPath, rmPath } = require('../utils/fs');

const pack = require('../package');

console.log(chalk.green('Start sd-cli...'));

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
        const projectPath = getFullPath(name);
        const spinner = ora();
        if (folderExist(name)) {
            inquire.prompt([
                {
                    type: 'confirm',
                    name: 'force',
                    message: '检查到已存在同名文件夹，是否覆盖?'
                },
            ]).then(answers => {
                if (answers.force) {
                    // 删除文件夹，下载代码
                    spinner.start('删除同名文件夹...');
                    rmPath(projectPath);
                    spinner.succeed('删除同名文件夹成功');
                    spinner.start('下载项目模板...');
                    downloadGitRepo('direct:http://bitbucket.iluvatar.ai:7990/scm/csdx/sdx-app-template.git', projectPath, {clone: true}, (err) => {

                        if (err) {
                            spinner.fail('下载模板失败');
                            return;
                        }
                        spinner.succeed('项目创建成功');
                    })
                } else {
                    console.log('正在取消创建项目...');
                    console.log('退出程序');
                    process.exit(1);
                }
            });
        } else {
            spinner.text = '下载项目模板...';
            spinner.start();
            downloadGitRepo('direct:http://bitbucket.iluvatar.ai:7990/scm/csdx/sdx-app-template.git', projectPath, {clone: true},(err) => {
                spinner.stop();
                if (err) {
                    throw new Error('下载仓库失败');
                }
                console.log(chalk.green('创建成功'));
            })
        }
        // 如果指定了模板
        if (cmd.template) {
            // 检查模板地址是否合法

        }
    });

program.parse(process.argv);