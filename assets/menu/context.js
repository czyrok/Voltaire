const langMenuProcess = require('../interface/lang.js')

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
            cut: langMenuProcess.lang[language]['menu']['edit']['cut'],
            copy: langMenuProcess.lang[language]['menu']['edit']['copy'],
            paste: langMenuProcess.lang[language]['menu']['edit']['paste'],
            inspect: langMenuProcess.lang[language]['menu']['edit']['inspect']
        },
        menu: (act, param) => [
            {
                label: langMenuProcess.lang[language]['menu']['edit']['undo'],
                visible: param.editFlags.canUndo,
                accelerator: 'CommandOrControl+Z',
                role: 'undo'
            },
            {
                label: langMenuProcess.lang[language]['menu']['edit']['redo'],
                visible: param.editFlags.canRedo,
                accelerator: 'CommandOrControl+Y',
                role: 'redo'
            },
            act.separator(),
            {
                label: langMenuProcess.lang[language]['menu']['edit']['select'],
                visible: param.isEditable,
                accelerator: 'CommandOrControl+A',
                role: 'selectAll'
            },
            act.separator(),
            {
                label: langMenuProcess.lang[language]['menu']['edit']['cut'],
                visible: param.editFlags.canCut,
                accelerator: 'CommandOrControl+X',
                role: 'cut'
            },
            {
                label: langMenuProcess.lang[language]['menu']['edit']['copy'],
                visible: param.editFlags.canCopy,
                accelerator: 'CommandOrControl+C',
                role: 'copy'
            },
            {
                label: langMenuProcess.lang[language]['menu']['edit']['paste'],
                visible: param.isEditable,
                accelerator: 'CommandOrControl+V',
                role: 'paste'
            },
            act.separator(),
            {
                label: langMenuProcess.lang[language]['menu']['app']['settings'],
                accelerator: 'CommandOrControl+,',
                click: () => {
                    if (settingsAreShowed == 0) showSettings()
                }
            }
        ]
    }

    return template
}