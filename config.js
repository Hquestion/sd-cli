const ComponentPrefixMap = {
    ui: 'Sdxu',
    widget: 'Sdxw',
    view: 'Sdxv'
};

const PACKAGE_TYPES = {
    UI: 'ui',
    WIDGET: 'widget',
    VIEW: 'view'
};

const DEST_TYPES = {
    PROJ_ROOT: 'PROJ_ROOT',
    PACK_ROOT: 'PACK_ROOT',
    COMP_ROOT: 'COMP_ROOT'
};

const varBEMMap = {
    ui: '$bem-namespace-ui',
    widget: '$bem-namespace-widget',
    view: '$bem-namespace-view'
};

module.exports = {
    packageQuestions: [
        {
            type: 'input',
            name: 'version',
            message: '版本号',
            default: '1.0.0'
        },
        {
            type: "input",
            name: 'description',
            message: '请输入项目描述',
            default: 'A project based on SDX'
        },
        {
            type: "list",
            name: 'packageManager',
            message: '请选择包管理工具',
            default: 0,
            choices: [
                'npm',
                'yarn'
            ]
        }
    ],
    ComponentPrefixMap,
    PACKAGE_TYPES,
    DEST_TYPES,
    varBEMMap
};
