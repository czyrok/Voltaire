const { app, ipcMain, session, BrowserWindow } = require('electron'),
    electronContextMenu = require('electron-context-menu'),

    globalProcess = require('./global.js'),
    contextMenuProcess = require('./menu/context.js'),

    debug = /--debug/.test(process.argv[2])

let win

module.exports.createWindow = () => {
    if (globalProcess.recoveredFilesCount == globalProcess.filesSavedCount) {
        clearInterval(globalProcess.intervalWindow)

        globalProcess.setWindowSettings()

        win = new BrowserWindow({
/*             show: false, */
            title: app.getName(),
            icon: 'assets/img/icons/icon.ico',
            minWidth: globalProcess.minWidth,
            minHeight: globalProcess.minHeight,
            width: globalProcess.width,
            height: globalProcess.height,
            x: globalProcess.x,
            y: globalProcess.y,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        if (debug) win.webContents.openDevTools()

        win.loadFile('assets/renderer/html/init.html')

        win.once('ready-to-show', () => {
            win.webContents.send('parameter-file', globalProcess.parameterFile)
            win.webContents.send('window-file', globalProcess.windowFile)
            win.webContents.send('recent-file', globalProcess.recentFile)

            if (globalProcess.URLFile !== undefined) win.webContents.send('first-file', globalProcess.URLFile)

            const updateSession = session.fromPartition('update')

            if (globalProcess.updateDownloadIsFinish == 0 && globalProcess.updateDownloadIsActive == 0 && globalProcess.updateRetry == 0) {
                /* updateSession.downloadURL(globalProcess.updateURL) */
            } else if (globalProcess.updateDownloadIsActive == 1) {
                win.webContents.send('update', globalProcess.updatePercent)
            }

            electronContextMenu(contextMenuProcess.template(globalProcess.parameterFile['lang'], win))
        })

        win.once('closed', () => {
            if (globalProcess.currentWindow == win) globalProcess.currentWindow = undefined
        })

        ipcMain.on('ready', () => {
            win.show()
            win.focus()
        })
    }
}