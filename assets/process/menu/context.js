const langProcess = require('../lang.js')

module.exports.template = function (language) {
    let template = {
        window: win,
        showLookUpSelection: true,
        showSearchWithGoogle: false,
        showCopyImage: false,
        showCopyImageAddress: false,
        showSaveImage: false,
        showSaveImageAs: false,
        showSaveLinkAs: false,
        showServices: false,
        labels: {
            cut: langProcess.lang[language]['menu']['edit']['cut'],
            copy: langProcess.lang[language]['menu']['edit']['copy'],
            paste: langProcess.lang[language]['menu']['edit']['paste'],
            inspect: langProcess.lang[language]['menu']['edit']['inspect']
        },
        menu: (act, param) => [
            {
                label: langProcess.lang[language]['menu']['edit']['undo'],
                visible: param.editFlags.canUndo,
                accelerator: 'CommandOrControl+Z',
                role: 'undo'
            },
            {
                label: langProcess.lang[language]['menu']['edit']['redo'],
                visible: param.editFlags.canRedo,
                accelerator: 'CommandOrControl+Y',
                role: 'redo'
            },
            act.separator(),
            {
                label: langProcess.lang[language]['menu']['edit']['select'],
                visible: param.isEditable,
                accelerator: 'CommandOrControl+A',
                role: 'selectAll'
            },
            act.separator(),
            {
                label: langProcess.lang[language]['menu']['edit']['cut'],
                visible: param.editFlags.canCut,
                accelerator: 'CommandOrControl+X',
                role: 'cut'
            },
            {
                label: langProcess.lang[language]['menu']['edit']['copy'],
                visible: param.editFlags.canCopy,
                accelerator: 'CommandOrControl+C',
                role: 'copy'
            },
            {
                label: langProcess.lang[language]['menu']['edit']['paste'],
                visible: param.isEditable,
                accelerator: 'CommandOrControl+V',
                role: 'paste'
            },
        ]
    }

    return template
}