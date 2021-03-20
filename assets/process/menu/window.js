const { app } = require('electron'),

    appProcess = require('../../app.js'),
    globalProcess = require('../global.js'),
    langProcess = require('../lang.js')

module.exports.template = function (language) {
    let template = [
        {
            label: globalProcess.darwin ? app.getName() : langProcess.lang[language]['menu']['app']['title'],
            submenu: [
                {
                    label: langProcess.lang[language]['menu']['app']['new-window'],
                    accelerator: 'CommandOrControl+Shift+N',
                    click() {
                        appProcess.activating()
                    }
                },
                { type: 'separator' },
                {
                    label: langProcess.lang[language]['menu']['app']['recent-files'],
                    accelerator: 'CommandOrControl+R',
                    click() {
                        appProcess.showMenu()
                    }
                },
                {
                    label: langProcess.lang[language]['menu']['app']['settings'],
                    accelerator: 'CommandOrControl+,',
                    click() {
                        appProcess.showSettings()
                    }
                },
                { type: 'separator' },
                {
                    label: langProcess.lang[language]['menu']['app']['exit'],
                    accelerator: 'CommandOrControl+W',
                    click() {
                        appProcess.quit()
                    }
                }
            ]
        },
        {
            label: langProcess.lang[language]['menu']['edit']['title'],
            submenu: [
                {
                    label: langProcess.lang[language]['menu']['edit']['undo'],
                    accelerator: 'CommandOrControl+Z',
                    role: 'undo'
                },
                {
                    label: langProcess.lang[language]['menu']['edit']['redo'],
                    accelerator: 'CommandOrControl+Y',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: langProcess.lang[language]['menu']['edit']['select'],
                    accelerator: 'CommandOrControl+A',
                    role: 'selectAll'
                },
                { type: 'separator' },
                {
                    label: langProcess.lang[language]['menu']['edit']['cut'],
                    accelerator: 'CommandOrControl+X',
                    role: 'cut'
                },
                {
                    label: langProcess.lang[language]['menu']['edit']['copy'],
                    accelerator: 'CommandOrControl+C',
                    role: 'copy'
                },
                {
                    label: langProcess.lang[language]['menu']['edit']['paste'],
                    accelerator: 'CommandOrControl+V',
                    role: 'paste'
                }
            ]
        }
    ]

    return template
}