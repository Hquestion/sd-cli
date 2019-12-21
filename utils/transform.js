const upperCaseFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const lowerCaseFirstLetter = (str) => {
    return str.charAt(0).toLowerCase() + str.slice(1);
};

const camel2dash = (str) => {
    return lowerCaseFirstLetter(str).replace(/[A-Z]/g, (matched) => {
        return '-' + matched.toLowerCase();
    });
};

module.exports = {
    upperCaseFirstLetter,
    lowerCaseFirstLetter,
    camel2dash
};