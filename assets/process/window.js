const { app, session, BrowserWindow } = require('electron'),

    globalProcess = require('./global.js'),

    debug = /--debug/.test(process.argv[2])

let win

module.exports.createWindow = () => {
    if (globalProcess.recoveredFilesCount == 3) {
        clearInterval(globalProcess.intervalWindow)

        win = new BrowserWindow({
            show: false,
            title: app.getName(),
            icon: 'assets/renderer/img/icons/icon.ico',
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

        win.loadFile('assets/renderer/html/index.html')

        win.once('ready-to-show', () => {
            win.show()
            win.focus()

            win.webContents.send('parameter-file', globalProcess.parameterFile)
            win.webContents.send('window-file', globalProcess.windowFile)
            win.webContents.send('recent-file', globalProcess.recentFile)

            if (globalProcess.URLFile !== undefined) win.webContents.send('first-file', globalProcess.URLFile)

            const updateSession = session.fromPartition('update')

            if (globalProcess.updateDownloadIsFinish == 0 && globalProcess.updateDownloadIsActive == 0 && globalProcess.updateRetry == 0) {
                // updateSession.downloadURL(globalProcess.updateURL)
            } else if (globalProcess.updateDownloadIsActive == 1) {
                win.webContents.send('update', globalProcess.updatePercent)
            }
        })

        win.once('closed', () => {
            if (globalProcess.currentWindow == win) globalProcess.currentWindow = undefined
        })

        /* electronLocalshortcut.register(win, 'Ctrl+Left', () => {
            globalProcess.currentWindow.webContents.send('show-menu')
        })

        electronLocalshortcut.register(win, 'Ctrl+Right', () => {
            globalProcess.currentWindow.webContents.send('remove-menu')
        }) */
    }
}