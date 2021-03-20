const { app, Menu } = require('electron'),
    fs = require('fs'),

    windowMenuProcess = require('./menu/window.js')

module.exports = {
    darwin: process.platform === 'darwin',

    updateFolderPath: `${app.getPath('userData')}\\Update\\`,
    storageFolderPath: `${app.getPath('userData')}\\Storage\\`,

    parameterFilePath: `${app.getPath('userData')}\\storage\\parameter.json`,
    defaultParameterFile: '{"lang":"en"}',

    windowFilePath: `${app.getPath('userData')}\\storage\\window.json`,
    defaultWindowFile: '{"dimension":{"width":-1,"height":-1},"position":{"x":-1,"y":-1},"maximized":0,"pin":0}',

    recentFilePath: `${app.getPath('userData')}\\storage\\recent.json`,
    defaultRecentFile: '[]',

    parameterFile: undefined,
    windowFile: undefined,
    recentFile: undefined,

    firstReadFiles: [],
    recoveredFilesCount: 0,
    savedFilesCount: 0,

    width: undefined,
    minWidth: 450,
    height: undefined,
    minHeight: 450,

    x: undefined,
    y: undefined,

    URLFile: undefined,
    intervalWindow: undefined,
    currentWindow: undefined,

    updateURL: undefined,
    updateDownloadIsActive: 0,
    updateRetry: 0,
    updateDownloadIsFinish: 0,
    updatePath: undefined,
    updateInterval: undefined,
    updatePercent: 0
}

module.exports.buildMenu = (language) => {
    return Menu.setApplicationMenu(Menu.buildFromTemplate(windowMenuProcess.template(language)))
}

module.exports.mkDir = (path) => {
    try {
        fs.mkdirSync(path)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

module.exports.rmDir = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file, index) => {
            let currentPath = path + '/' + file

            if (fs.lstatSync(currentPath).isDirectory()) {
                rmdirSync(currentPath)
            } else {
                fs.unlinkSync(currentPath)
            }
        })

        fs.rmdirSync(path)
    }
}

module.exports.isValidJSON = (file) => {
    try {
        JSON.parse(file)
        return true
    } catch {
        return false
    }
}