const fs = require('fs');
const path = require('path');
const execa = require('execa');
const { getFullPath } = require('../utils/fs');

module.exports = function(name, options) {
    const projectPath = getFullPath(name);
    const owner = execa.commandSync('npm whoami').stdout;
    const packPath = path.resolve(projectPath, 'package.json');
    const pack = fs.readFileSync(packPath, {
        encoding: 'utf8'
    });
    const packObj = JSON.parse(pack.toString());
    packObj.name = options.projectName || '';
    packObj.version = options.projectVersion;
    packObj.description = options.projectDesc;
    packObj.author = owner;

    fs.writeFileSync(packPath, JSON.stringify(packObj, null, '\t'), {
        encoding: 'utf8'
    });
};