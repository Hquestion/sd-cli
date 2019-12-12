const execa = require("execa");
const path = require('path');
const chalk = require('chalk');

const REGISTRY_URL = 'http://192.168.20.38:4873';

const commandMap = {
    npm: {
        install: ['install', '--registry', REGISTRY_URL]
    },
    yarn: {
        install: ['install', '--registry', REGISTRY_URL]
    }
};

exports.install = (name, packageManager) => {
    return new Promise((resolve, reject) => {
        const child = execa(packageManager, commandMap[packageManager].install, {
            cwd: path.join(process.cwd(), name)
        });
        child.stderr.on('data', buf => {
            if (/warning/.test(buf.toString())) {
                console.log(chalk.yellow(buf.toString()));
            } else {
                console.log(chalk.red(buf.toString()));
            }
        });
        child.stdout.on('data', e => {
            console.info(e.toString());
        });
        child.on('close', e => {
            if (e !== 0) {
                process.exit(1);
                reject();
            }
            resolve();
        });
    });
};