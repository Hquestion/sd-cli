const fs = require('fs');
const path = require('path');

exports.isLegalTemplate = function (url) {
    return url.indexOf('.git') > 0;
};
