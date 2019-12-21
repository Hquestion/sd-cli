const fs = require('fs');
const path = require('path');
const { upperCaseFirstLetter, lowerCaseFirstLetter, camel2dash } = require('../utils/transform');
const { PACKAGE_TYPES, DEST_TYPES } = require('../config');
const { makeIndexJs, makeVueFile, writeToComponentJS, writeComponentMain, makeSassFile } = require('../utils/template');
const { rmPath } = require('../utils/fs');

module.exports = {
    componentScaffold(name, cmd) {
        const pwd = validateCwd();
        const componentName = name;
        const packageName = cmd.package || pwd.packName;
        let destPath = compDestPath(pwd, packageName, componentName);

        if (fs.existsSync(destPath)) {
            if (!cmd.force) {
                throw new Error('组件已存在，请修改组件名称！');
            } else {
                rmPath(destPath);
            }
        }
        fs.mkdirSync(destPath);
        scaffoldDir(destPath, packageName, componentName);
    }
};

function validateCwd() {
    const cwd = process.cwd();
    const packageTypeNames = Object.values(PACKAGE_TYPES);
    const isPackageRoot = () => {
        const PackRootPath = path.resolve('/', 'packages');
        const children = fs.readdirSync(cwd);
        console.log(children);
        const isRoot = children.length === packageTypeNames.length
            && children.sort((a, b) => a-b).join('') === packageTypeNames.sort((a, b) => a-b).join('');
        return cwd.endsWith(PackRootPath) && isRoot;
    };

    const isProjRoot = () => {
        try {
            const pack = fs.readFileSync(path.resolve(cwd, 'package.json'), {
                encoding: 'utf8'
            });
            const packObj = JSON.parse(pack);
            if (packObj.name === 'root' && fs.existsSync(path.resolve(cwd, 'packages'))) {
                return true;
            } else {
                return false;
            }
        }catch (e) {
            return false;
        }
    };

    const atPackage = packageTypeNames.find(item => {
        const compPackPath = path.resolve('/', 'packages', item);
        return cwd.endsWith(compPackPath);
    });
    if (isProjRoot()) {
        return {
            dest: DEST_TYPES.PROJ_ROOT
        }
    } else if (isPackageRoot()) {
        return {
            dest: DEST_TYPES.PACK_ROOT
        }
    } else if (atPackage) {
        return {
            dest: DEST_TYPES.COMP_ROOT,
            packName: atPackage
        }
    }
    throw new Error('当前路径似乎不正确，请切换到项目根目录/packages目录/组件库根目录下再试！');
}

function compDestPath(cwd, packName, compName) {
    if (cwd.dest === DEST_TYPES.PROJ_ROOT) {
        return path.resolve(process.cwd(),'packages', packName, 'components', compName);
    } else if (cwd.dest === DEST_TYPES.PACK_ROOT) {
        return path.resolve(process.cwd(), packName, 'components', compName);
    } else {
        return path.resolve(process.cwd(), '../', packName, 'components', compName);
    }
}

function scaffoldDir(path, packName, compName) {
    makeCommonComponent(path, packName, compName);
}

function makeCommonComponent(folderPath, packName, compName) {
    compName = upperCaseFirstLetter(compName);
    fs.writeFileSync(path.resolve(folderPath, 'index.js'), makeIndexJs(compName, packName));
    fs.mkdirSync(path.resolve(folderPath, 'src'));
    fs.writeFileSync(path.resolve(folderPath, 'src', `${compName}.vue`), makeVueFile(compName, packName));
    writeToComponentJS(folderPath, compName, packName);
    if (packName !== PACKAGE_TYPES.VIEW) {
        writeComponentMain(folderPath, compName, packName);
    }
    makeSassFile(folderPath, compName, packName);
}

