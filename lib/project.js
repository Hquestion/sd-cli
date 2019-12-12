const chalk = require('chalk');
const inquire = require('inquirer');
const ora = require('ora');
const downloadGitRepo = require('download-git-repo');
const { folderExist, getFullPath, rmPath } = require('../utils/fs');
const { install } = require('../utils/installDependence');
const { packageQuestions } = require('../config');
const rewritePackage = require('../utils/rewritePackage');

const TMPL_URL = 'http://bitbucket.iluvatar.ai:7990/scm/csdx/sdx-app-template.git';

let projectName,
    projectVersion = '1.0.0',
    projectDesc = 'A project based on SDX',
    owner = '',
    packageManager = 'npm';

module.exports = {
    async create(name, cmd) {
        const projectPath = getFullPath(name);
        const spinner = ora();
        let needRmdir = false;
        // 扫描文件夹，检查是否有重名文件
        spinner.start('正在扫描当前路径...');
        if (folderExist(name)) {
            spinner.succeed('扫描当前路径结束');
            if (!cmd.force) {
                const answer = await inquire.prompt([
                    {
                        type: 'confirm',
                        name: 'force',
                        message: '检查到已存在同名文件夹，是否覆盖?',
                        default: true
                    },
                ]);
                if (!answer.force) {
                    spinner.fail('退出程序');
                    process.exit(1);
                    return;
                }
            }
            needRmdir = true;
        }else {
            spinner.succeed('扫描当前路径结束');
        }
        const answer = await inquire.prompt(packageQuestions);
        projectName = name;
        projectVersion = answer.version;
        projectDesc = answer.description;
        packageManager = answer.packageManager;

        if (needRmdir) {
            spinner.start('删除同名文件夹...');
            rmPath(projectPath);
            spinner.succeed('删除同名文件夹成功');
        }
        // 下载模板
        spinner.start('开始下载项目模板...');
        try {
            let result = await downloadRepo(cmd.template, projectPath);
            spinner.succeed(result);
        } catch (e) {
            spinner.fail(e);
            process.exit(1);
        }
        // 进入项目，初始化项目
        spinner.start('修改项目信息...');
        rewritePackage(name, {projectName, projectVersion, projectDesc});
        spinner.succeed('修改项目信息成功');
        console.log(chalk.blue('安装依赖...'));
        await install(name, packageManager);
        spinner.succeed('项目初始化完成');

        console.log(chalk.green(`
            尝试以下命令开始你的开发之旅吧！\n
            ${packageManager} run serve  --启动开发环境 \n
            ${packageManager} run build  --项目构建 \n
            ${packageManager} run lint   --eslint检查 \n
        `));
    }
};

function downloadRepo(tmpl, projectPath) {
    let _resolve, _reject;
    tmpl = tmpl || TMPL_URL;
    downloadGitRepo(`direct:${tmpl}`, projectPath, {clone: true}, (err) => {
        if (err) {
            _reject('下载模板失败');
        }
        _resolve('项目创建成功');
    });
    return new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
}