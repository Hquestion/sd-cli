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
    ]
};