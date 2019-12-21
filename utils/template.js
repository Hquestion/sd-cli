const {
    upperCaseFirstLetter,
    lowerCaseFirstLetter,
    camel2dash
} = require('../utils/transform');

const { ComponentPrefixMap, varBEMMap } = require('../config');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * 获取组件index.js模版
 * @param compName
 * @param packName
 * @returns {string}
 */
function makeIndexJs(compName, packName) {
    const upperCompName = upperCaseFirstLetter(compName);
    return (
        `import ${upperCompName} from './src/${upperCompName}';
        
${upperCompName}.install = Vue => Vue.component(${upperCompName}.name, ${upperCompName});
    
export default ${upperCompName};
`
    )
}

/**
 * 获取Vue组件模板
 * @param compName
 * @param packName
 * @returns {string}
 */
function makeVueFile(compName, packName) {
    return (
        `<template>
    <div class="${lowerCaseFirstLetter(ComponentPrefixMap[packName])}-${camel2dash(compName)}"></div>
</template>
<script>

export default {
    name: '${upperCaseFirstLetter(ComponentPrefixMap[packName])}${compName}',
    data() {
        return {};
    },
    components: {},
    methods: {},
    mount() {}
};
</script>

<style lang="scss" scoped>

</style>
        `
    );
}

/**
 * 创建sass文件
 * @param folderPath
 * @param compName
 * @param packName
 */
const makeSassFile = function(folderPath, compName, packName) {
    // todo 创建sass文件，并初始化block模板，写入index.scss文件中
    let fileName = camel2dash(lowerCaseFirstLetter(compName));
    let scssConfigPath = path.resolve(folderPath, '../../theme', '_' + fileName + '.scss');
    let scssIndexPath = path.resolve(folderPath, '../../theme', 'index.scss');
    fs.writeFileSync(scssConfigPath, `@include block('${fileName}', ${varBEMMap[packName]}) {\n\n}`);
    let file = fs.readFileSync(scssIndexPath, {encoding: 'utf8'});
    file += `\n    @import '${fileName}'`;
    fs.writeFileSync(scssIndexPath, file);
};

/**
 * 在component.js中增加组件配置
 * @param folderPath
 * @param compName
 * @param packName
 */
const writeToComponentJS = function(folderPath, compName, packName) {
    let componentConfigPath = path.resolve(folderPath, '../../components.js');
    fs.readFile(componentConfigPath, {
        encoding: 'utf8'
    }, (err, file) => {
        if(err) {
            throw err;
        }
        let fileLines = file.split('\n');
        let dashCompName = camel2dash(lowerCaseFirstLetter(compName));
        const tpl = `    '${dashCompName}': './components/${dashCompName}/index.js',`;
        fileLines.splice(fileLines.length - 2, 0, tpl);
        fs.writeFileSync(componentConfigPath, fileLines.join('\n'));
    });
};

/**
 * 写组件库index.js文件
 * @param folderPath
 * @param compName
 * @param packName
 */
const writeComponentMain = function(folderPath, compName, packName) {
    const mainConfigPath = path.resolve(folderPath, '../../index.js');
    let fileNew = '';
    fs.readFile(mainConfigPath, {encoding: 'utf8'}, (err, file) => {
        if (err) throw err;
        let packageName = '';
        fileNew = file.replace(/(import \{.*\} from .*;)/, (item) => {
            return `import ${upperCaseFirstLetter(compName)} from './components/${camel2dash(compName)}';\n${item}`;
        });
        fileNew = fileNew.replace(/const ([^=]+) = \{\n([^\}]+)\n\}/, (item, a1, a2) => {
            let matched = a2;
            if (!matched.endsWith(',')) {
                matched = matched + ',';
            }
            packageName = a1;
            return `const ${a1} = {\n${matched}\n    ${upperCaseFirstLetter(compName)},\n}`;
        });
        const installReg = eval(`/${packageName}\\.install = (\\([^\\)]+\\)) => \\{\\n([^\\}]+)\\}/`);
        fileNew = fileNew.replace(installReg, function (item, a1, a2) {
            return `${packageName}.install = ${a1} => {\n${a2}    ${upperCaseFirstLetter(compName)}.install(vue);\n}`;
        });
        fs.writeFileSync(mainConfigPath, fileNew);
    });
};

exports.makeIndexJs = makeIndexJs;
exports.makeVueFile = makeVueFile;
exports.makeSassFile = makeSassFile;
exports.writeToComponentJS = writeToComponentJS;
exports.writeComponentMain = writeComponentMain;