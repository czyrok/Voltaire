const langConfig = require('../../../config/lang-config.json')

module.exports.template = function (language, win) {
    let template = {
        window: win,
        showLookUpSelection: false,
        showSearchWithGoogle: false,
        showCopyImage: false,
        showCopyImageAddress: false,
        showSaveImage: false,
        showSaveImageAs: false,
        showSaveLinkAs: false,
        showServices: false,
        menu: (act, param) => [
            {
                label: langConfig[language]['menu']['edit']['undo'],
                visible: param.editFlags.canUndo,
                accelerator: 'CommandOrControl+Z',
                role: 'undo'
            },
            {
                label: langConfig[language]['menu']['edit']['redo'],
                visible: param.editFlags.canRedo,
                accelerator: 'CommandOrControl+Y',
                role: 'redo'
            },
            act.separator(),
            {
                label: langConfig[language]['menu']['edit']['select'],
                visible: param.isEditable,
                accelerator: 'CommandOrControl+A',
                role: 'selectAll'
            },
            act.separator(),
            {
                label: langConfig[language]['menu']['edit']['cut'],
                visible: param.editFlags.canCut,
                accelerator: 'CommandOrControl+X',
                role: 'cut'
            },
            {
                label: langConfig[language]['menu']['edit']['copy'],
                visible: param.editFlags.canCopy,
                accelerator: 'CommandOrControl+C',
                role: 'copy'
            },
            {
                label: langConfig[language]['menu']['edit']['paste'],
                visible: param.isEditable,
                accelerator: 'CommandOrControl+V',
                role: 'paste'
            },
            act.separator(),
            {
                role: 'toggleDevTools'
            },
        ]
    }

    return template
}