const { app, ipcMain, shell, session, BrowserWindow } = require('electron'),

    globalProcess = require('./process/global.js'),
    fileProcess = require('./process/file.js'),
    windowProcess = require('./process/window.js'),

    gotTheLock = app.requestSingleInstanceLock(),
    thisUpdate = `${app.getName()} Update Setup ${app.getVersion()}.exe`

globalProcess.darwin ? globalProcess.updateURL = `http://d.update.${app.getName()}.czyrok.ovh/` : globalProcess.updateURL = `http://w.update.${app.getName()}.czyrok.ovh/`

function quit() {
    if (globalProcess.updateDownloadIsFinish == 1) {
        launchUpdate()
    } else {
        fileProcess.saveFiles()

        function exit() {
            if (globalProcess.savedFilesCount == 3) {
                clearInterval(globalProcess.updateInterval)

                app.quit()
            }
        }

        globalProcess.updateInterval = setInterval(exit, 250)
    }
}

function launchUpdate() {
    fileProcess.saveFiles()

    async function exit() {
        if (globalProcess.savedFilesCount == 3) {
            clearInterval(globalProcess.updateInterval)

            await shell.openPath(globalProcess.updatePath)

            app.quit()
        }
    }

    globalProcess.updateInterval = setInterval(exit, 250)
}

function activating(url) {
    if (globalProcess.recoveredFilesCount == 0) {
        fileProcess.parameterFileReading()
        fileProcess.windowFileReading()
        fileProcess.recentFileReading()
    }

    globalProcess.URLFile = url
    globalProcess.intervalWindow = setInterval(windowProcess.createWindow, 250)
}

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (e, commandLine) => {
        // marche pas

        if (commandLine[2] !== undefined) {
            if (globalProcess.currentWindow === undefined) {
                activating(commandLine[2])
            } else {
                globalProcess.currentWindow.webContents.send('tab-end', commandLine[2])
            }
        } else {
            activating()
        }
    })

    app.on('ready', () => {
        app.allowRendererProcessReuse = true

        globalProcess.mkDir(globalProcess.storageFolderPath)
        globalProcess.rmDir(globalProcess.updateFolderPath)

        if (process.argv.length >= 2) {
            activating(process.argv[1])
        } else {
            activating()
        }

        const updateSession = session.fromPartition('update')

        updateSession.on('will-download', (e, item) => {
            if (item.getFilename().indexOf('.exe') != -1) {
                globalProcess.updateDownloadIsActive = 1

                item.setSavePath(`${globalProcess.updateFolderPath}${item.getFilename()}`)
                globalProcess.updatePath = `${globalProcess.updateFolderPath}${item.getFilename()}`

                item.on('updated', (e, state) => {
                    if (state == 'interrupted') {
                        if (globalProcess.updateRetry == 5) {
                            item.cancel()
                        } else {
                            item.resume()
                            globalProcess.updateRetry++
                        }
                    } else if (state === 'progressing') {
                        let percent = ((item.getReceivedBytes() / item.getTotalBytes()) * 100) / 2

                        if (percent != 50) percent = Math.round(percent)

                        globalProcess.updatePercent = percent

                        BrowserWindow.getAllWindows().forEach(window => window.webContents.send('update', globalProcess.updatePercent))
                    }
                })

                item.once('done', (e, state) => {
                    if (state == 'completed') {
                        globalProcess.updateDownloadIsFinish = 1
                    }

                    globalProcess.updateDownloadIsActive = 0
                })

                if (thisUpdate == item.getFilename()) {
                    item.cancel()
                } else {
                    BrowserWindow.getAllWindows().forEach(window => window.webContents.send('update', globalProcess.updatePercent))
                }
            } else {
                globalProcess.updateDownloadIsActive = 0
            }
        })
    })

    app.on('window-all-closed', () => {
        if (!globalProcess.darwin) {
            quit()
        }
    })

    app.on('activate', () => {
        activating()
    })

    app.on('browser-window-focus', (e, window) => {
        globalProcess.currentWindow = window
    })
}

module.exports.activating = (url) => {
    activating(url)
}

module.exports.quit = () => {
    BrowserWindow.getAllWindows().forEach((window) => window.close())
}

module.exports.showMenu = () => {
    globalProcess.currentWindow.webContents.send('show-menu')
}

module.exports.showSettings = () => {
    globalProcess.currentWindow.webContents.send('show-settings')
}

ipcMain.on('reset-parameter-file', () => {
    globalProcess.parameterFile = JSON.parse(globalProcess.defaultParameterFile)

    BrowserWindow.getAllWindows().forEach(window => window.webContents.send('parameter-file', globalProcess.parameterFile))
})

ipcMain.on('new-parameter-file', (e, file) => {
    if (globalProcess.parameterFile['lang'] != file['lang']) globalProcess.buildMenu(file['lang'])

    globalProcess.parameterFile = file

    BrowserWindow.getAllWindows().forEach(window => window.webContents.send('parameter-file', globalProcess.parameterFile))
})

ipcMain.on('new-window-file', (e, file) => {
    globalProcess.windowFile = file
})

ipcMain.on('new-window', () => {
    activating()
})