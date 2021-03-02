const { app } = require('electron'),
    appProcess = require('../app.js'),
    langMenuProcess = require('../interface/lang.js')

module.exports.template = function (language) {
    let template = [
        {
            label: app.getName(),
            submenu: [
                {
                    label: langMenuProcess.lang[language]['menu']['app']['new-window'],
                    accelerator: 'CommandOrControl+Shift+N',
                    click() {
                        appProcess.activating()
                    }
                },
                { type: 'separator' },
                {
                    label: langMenuProcess.lang[language]['menu']['app']['recent-files'],
                    accelerator: 'CommandOrControl+R',
                    click() {
                        appProcess.showMenu()
                    }
                },
                {
                    label: langMenuProcess.lang[language]['menu']['app']['settings'],
                    accelerator: 'CommandOrControl+,',
                    click() {
                        appProcess.showSettings()
                    }
                },
                { type: 'separator' },
                {
                    label: langMenuProcess.lang[language]['menu']['app']['exit'],
                    accelerator: 'CommandOrControl+W',
                    click() {
                        appProcess.quit()
                    }
                }
            ]
        },
        {
            label: langMenuProcess.lang[language]['menu']['edit']['title'],
            submenu: [
                {
                    label: langMenuProcess.lang[language]['menu']['edit']['undo'],
                    accelerator: 'CommandOrControl+Z',
                    role: 'undo'
                },
                {
                    label: langMenuProcess.lang[language]['menu']['edit']['redo'],
                    accelerator: 'CommandOrControl+Y',
                    role: 'redo'
                },
                { type: 'separator' },
                {
                    label: langMenuProcess.lang[language]['menu']['edit']['select'],
                    accelerator: 'CommandOrControl+A',
                    role: 'selectAll'
                },
                { type: 'separator' },
                {
                    label: langMenuProcess.lang[language]['menu']['edit']['cut'],
                    accelerator: 'CommandOrControl+X',
                    role: 'cut'
                },
                {
                    label: langMenuProcess.lang[language]['menu']['edit']['copy'],
                    accelerator: 'CommandOrControl+C',
                    role: 'copy'
                },
                {
                    label: langMenuProcess.lang[language]['menu']['edit']['paste'],
                    accelerator: 'CommandOrControl+V',
                    role: 'paste'
                }
            ]
        }
    ]

    return template
}