const { app } = require('electron'),

    appProcess = require('../../app.js'),
    globalProcess = require('../global.js'),
    langConfig = require('../../../config/lang-config.json')

module.exports.template = function (language) {
    let template = [
        {
            label: globalProcess.darwin ? app.getName() : langConfig[language]['menu']['app']['title'],
            submenu: [
                {
                    label: langConfig[language]['menu']['app']['new-window'],
                    accelerator: 'CommandOrControl+N',
                    click() {
                        appProcess.activating()
                    }
                },
                { type: 'separator' },
                {
                    label: langConfig[language]['menu']['app']['recent-files'],
                    accelerator: 'CommandOrControl+R',
                    click() {
                        appProcess.showMenu()
                    }
                },
                {
                    label: langConfig[language]['menu']['app']['settings'],
                    accelerator: 'CommandOrControl+,',
                    click() {
                        appProcess.showSettings()
                    }
                },
                { type: 'separator' },
                {
                    label: langConfig[language]['menu']['app']['exit'],
                    accelerator: 'CommandOrControl+W',
                    click() {
                        appProcess.quit()
                    }
                }
            ]
        },
        {
            label: langConfig[language]['menu']['edit']['title'],
            submenu: [
                {
                    label: langConfig[language]['menu']['edit']['undo'],
                    accelerator: 'CommandOrControl+Z',
                    role: 'undo'
                },
                {
                    label: langConfig[language]['menu']['edit']['redo'],
                    accelerator: 'CommandOrControl+Y',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: langConfig[language]['menu']['edit']['select'],
                    accelerator: 'CommandOrControl+A',
                    role: 'selectAll'
                },
                { type: 'separator' },
                {
                    label: langConfig[language]['menu']['edit']['cut'],
                    accelerator: 'CommandOrControl+X',
                    role: 'cut'
                },
                {
                    label: langConfig[language]['menu']['edit']['copy'],
                    accelerator: 'CommandOrControl+C',
                    role: 'copy'
                },
                {
                    label: langConfig[language]['menu']['edit']['paste'],
                    accelerator: 'CommandOrControl+V',
                    role: 'paste'
                }
            ]
        }
    ]

    return template
}