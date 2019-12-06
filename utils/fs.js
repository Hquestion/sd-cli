const path = require('path');
const fs = require('fs');

exports.getFullPath = (name) => {
    return path.resolve(process.cwd(), name);
};

exports.folderExist = (name) => {
    return fs.existsSync(this.getFullPath(name));
};

exports.rmPath = (folder) => {
    const state = fs.lstatSync(folder);
    if (state.isDirectory()) {
        const files = fs.readdirSync(folder);
        if (files.length > 0) {
            files.forEach(file => {
                this.rmPath(path.resolve(folder, file));
            });
            fs.rmdirSync(folder);
        } else {
            fs.rmdirSync(folder);
        }
    } else {
        fs.unlinkSync(folder);
    }
};