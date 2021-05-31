const { app, screen, Menu } = require('electron'),
    fs = require('fs'),

    windowMenuProcess = require('./menu/window.js')

let globalProcess = {
    darwin: process.platform === 'darwin',

    updateFolderPath: `${app.getPath('userData')}/Update/`,
    storageFolderPath: `${app.getPath('userData')}/Storage/`,

    parameterFilePath: `${app.getPath('userData')}/Storage/parameter.json`,
    defaultParameterFile: '{"lang":"en"}',

    windowFilePath: `${app.getPath('userData')}/Storage/window.json`,
    defaultWindowFile: '{"dimension":{"width":-1,"height":-1},"position":{"x":-1,"y":-1},"maximized":0,"pin":0}',

    recentFilePath: `${app.getPath('userData')}/Storage/recent.json`,
    defaultRecentFile: '[]',

    parameterFile: undefined,
    windowFile: undefined,
    recentFile: undefined,

    firstReadFiles: [],
    recoveredFilesCount: 0,
    savedFilesCount: 0,
    filesSavedCount: 3,

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

module.exports = globalProcess

module.exports.setWindowSettings = async () => {
    const widthScreen = screen.getPrimaryDisplay().workAreaSize.width
    const heightScreen = screen.getPrimaryDisplay().workAreaSize.height

    if (
        globalProcess.windowFile['dimension']['width'] == -1
        || globalProcess.windowFile['dimension']['height'] == -1
    ) {
        globalProcess.width = Math.round(widthScreen * 0.75)
        globalProcess.height = Math.round(heightScreen * 0.75)

        if (globalProcess.width < globalProcess.minWidth) globalProcess.width = globalProcess.minWidth
        if (globalProcess.height < globalProcess.minHeight) globalProcess.height = globalProcess.minHeight

        globalProcess.windowFile['dimension']['width'] = globalProcess.width
        globalProcess.windowFile['dimension']['height'] = globalProcess.height
    } else {
        globalProcess.width = Math.round(globalProcess.windowFile['dimension']['width'])
        globalProcess.height = Math.round(globalProcess.windowFile['dimension']['height'])
    }

    if (
        globalProcess.windowFile['position']['x'] == -1
        || globalProcess.windowFile['position']['y'] == -1
    ) {
        globalProcess.x = Math.round(widthScreen / 2 - globalProcess.width / 2)
        globalProcess.y = Math.round(heightScreen / 2 - globalProcess.height / 2)

        globalProcess.windowFile['position']['x'] = globalProcess.x
        globalProcess.windowFile['position']['y'] = globalProcess.y
    } else {
        globalProcess.x = Math.round(globalProcess.windowFile['position']['x'])
        globalProcess.y = Math.round(globalProcess.windowFile['position']['y'])
    }
}

module.exports.buildWindowMenu = async (language) => {
    return Menu.setApplicationMenu(Menu.buildFromTemplate(windowMenuProcess.template(language)))
}

module.exports.mkDir = (path) => {
    try {
        fs.mkdirSync(path)
    } catch (error) {
        if (error.code !== 'EEXIST') throw error
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