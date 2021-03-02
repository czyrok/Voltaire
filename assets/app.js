const { app, ipcMain, screen, shell, session, BrowserWindow, Menu } = require('electron'),
    fs = require('fs'),
    windowMenuProcess = require('./menu/window.js'),
    electronLocalshortcut = require('electron-localshortcut'),

    debug = /--debug/.test(process.argv[2]),
    gotTheLock = app.requestSingleInstanceLock(),

    darwin = process.platform == 'darwin',
    thisUpdate = `${app.getName()} Update Setup ${app.getVersion()}.exe`,

    updateFolderPath = `${app.getPath('userData')}\\Update\\`,
    storageFolderPath = `${app.getPath('userData')}\\Storage\\`,

    parameterFilePath = `${app.getPath('userData')}\\storage\\parameter.json`,
    defaultParameterFile = '{"lang":"en"}',

    windowFilePath = `${app.getPath('userData')}\\storage\\window.json`,
    defaultWindowFile = '{"dimension":{"width":-1,"height":-1},"position":{"x":-1,"y":-1},"maximized":0,"pin":0}',

    recentFilePath = `${app.getPath('userData')}\\storage\\recent.json`,
    defaultRecentFile = '[]',

    minWidth = 450,
    minHeight = 450

let firstReadFiles = [],
    parameterFile,
    windowFile,
    recentFile,
    recoveredFilesCount = 0,
    savedFilesCount = 0,

    width,
    height,
    x,
    y,
    URLFile,

    win,
    intervalWindow,
    currentWindow = null,

    updateURL,
    updateDownloadIsActive = 0,
    updateRetry = 0,
    updateDownloadIsFinish = 0,
    updatePath,
    updateInterval,
    updatePercent = 0

darwin ? updateURL = `http://d.update.${app.getName()}.czyrok.ovh/` : updateURL = `http://w.update.${app.getName()}.czyrok.ovh/`

function buildMenu(language) {
    return Menu.setApplicationMenu(Menu.buildFromTemplate(windowMenuProcess.template(language)))
}

function mkdirSync(path) {
    try {
        fs.mkdirSync(path)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

function rmdirSync(path) {
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

function isValidJSON(file) {
    try {
        JSON.parse(file)
        return true
    } catch {
        return false
    }
}

async function quit() {
    if (updateDownloadIsFinish == 1) {
        launchUpdate()
    } else {
        saveFiles()

        async function exit() {
            if (savedFilesCount == 3) {
                clearInterval(updateInterval)

                app.quit()
            }
        }

        updateInterval = setInterval(exit, 250)
    }
}

function launchUpdate() {
    saveFiles()

    async function exit() {
        if (savedFilesCount == 3) {
            clearInterval(updateInterval)

            await shell.openPath(updatePath)

            app.quit()
        }
    }

    updateInterval = setInterval(exit, 250)
}

async function saveFiles() {
    mkdirSync(storageFolderPath)

    fs.writeFile(parameterFilePath, JSON.stringify(parameterFile), (err) => {
        if (err) console.error(err)

        savedFilesCount++
    })

    fs.writeFile(windowFilePath, JSON.stringify(windowFile), (err) => {
        if (err) console.error(err)

        savedFilesCount++
    })

    fs.writeFile(recentFilePath, JSON.stringify(recentFile), (err) => {
        if (err) console.error(err)

        savedFilesCount++
    })
}

function parameterFileReading() {
    fs.readFile(parameterFilePath, (err, readParameterFile) => {
        if (err) console.error(err)

        if (readParameterFile === undefined) {
            parameterFile = JSON.parse(defaultParameterFile)

            firstReadFiles.push(JSON.parse(defaultParameterFile))
        } else if (isValidJSON(readParameterFile) === true) {
            parameterFile = JSON.parse(readParameterFile)

            firstReadFiles.push(JSON.parse(readParameterFile))
        } else {
            return parameterFileReading()
        }

        buildMenu(parameterFile['lang'])

        recoveredFilesCount++
    })
}

function windowFileReading() {
    fs.readFile(windowFilePath, (err, readWindowFile) => {
        if (err) console.error(err)

        if (readWindowFile === undefined) {
            windowFile = JSON.parse(defaultWindowFile)

            firstReadFiles.push(JSON.parse(defaultWindowFile))
        } else if (isValidJSON(readWindowFile) === true) {
            windowFile = JSON.parse(readWindowFile)

            firstReadFiles.push(JSON.parse(readWindowFile))
        } else {
            return windowFileReading()
        }

        const widthScreen = screen.getPrimaryDisplay().workAreaSize.width
        const heightScreen = screen.getPrimaryDisplay().workAreaSize.height

        if (
            windowFile['dimension']['width'] == -1
            || windowFile['dimension']['height'] == -1
        ) {
            width = Math.round(widthScreen * 0.75)
            height = Math.round(heightScreen * 0.75)

            if (width < minWidth) width = minWidth
            if (height < minHeight) height = minHeight

            windowFile['dimension']['width'] = width
            windowFile['dimension']['height'] = height
        } else {
            width = Math.round(windowFile['dimension']['width'])
            height = Math.round(windowFile['dimension']['height'])
        }

        if (
            windowFile['position']['x'] == -1
            || windowFile['position']['y'] == -1
        ) {
            x = Math.round(widthScreen / 2 - width / 2)
            y = Math.round(heightScreen / 2 - height / 2)

            windowFile['position']['x'] = x
            windowFile['position']['y'] = y
        } else {
            x = Math.round(windowFile['position']['x'])
            y = Math.round(windowFile['position']['y'])
        }

        recoveredFilesCount++
    })
}

function recentFileReading() {
    fs.readFile(recentFilePath, (err, readRecentFile) => {
        if (err) console.error(err)

        if (readRecentFile === undefined) {
            recentFile = JSON.parse(defaultRecentFile)

            firstReadFiles.push(JSON.parse(defaultRecentFile))
        } else if (isValidJSON(readRecentFile) === true) {
            recentFile = JSON.parse(readRecentFile)

            firstReadFiles.push(JSON.parse(readRecentFile))
        } else {
            return recentFileReading()
        }

        recoveredFilesCount++
    })
}

function createWindow() {
    if (recoveredFilesCount == 3) {
        clearInterval(intervalWindow)

        win = new BrowserWindow({
            show: false,
            title: app.getName(),
            icon: 'assets/img/icons/icon.ico',
            minWidth: minWidth,
            minHeight: minHeight,
            width: width,
            height: height,
            x: x,
            y: y,
            webPreferences: {
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false
            }
        })

        if (debug) win.webContents.openDevTools()

        win.loadFile('assets/interface/index.html')

        win.once('ready-to-show', () => {
            win.show()
            win.focus()

            win.webContents.send('parameter-file', parameterFile)
            win.webContents.send('window-file', windowFile)
            win.webContents.send('recent-file', recentFile)

            if (URLFile !== undefined) win.webContents.send('first-file', URLFile)

            const updateSession = session.fromPartition('update')

            if (updateDownloadIsFinish == 0 && updateDownloadIsActive == 0 && updateRetry == 0) {
                // updateSession.downloadURL(updateURL)
            } else if (updateDownloadIsActive == 1) {
                win.webContents.send('update', updatePercent)
            }
        })

        win.once('closed', () => {
            if (currentWindow == win) currentWindow = null
        })

        electronLocalshortcut.register(win, 'Ctrl+Left', () => {
            currentWindow.webContents.send('show-menu')
        })

        electronLocalshortcut.register(win, 'Ctrl+Right', () => {
            currentWindow.webContents.send('remove-menu')
        })
    }
}

function activating(url) {
    if (recoveredFilesCount == 0) {
        parameterFileReading()
        windowFileReading()
        recentFileReading()
    }

    URLFile = url
    intervalWindow = setInterval(createWindow, 250)
}

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (e, commandLine) => {
        // marche pas

        if (commandLine[2] !== undefined) {
            if (currentWindow === null) {
                activating(commandLine[2])
            } else {
                currentWindow.webContents.send('tab-end', commandLine[2])
            }
        } else {
            activating()
        }
    })

    app.on('ready', () => {
        app.allowRendererProcessReuse = true

        mkdirSync(storageFolderPath)
        rmdirSync(updateFolderPath)

        if (process.argv.length >= 2) {
            activating(process.argv[1])
        } else {
            activating()
        }

        const updateSession = session.fromPartition('update')

        updateSession.on('will-download', (e, item) => {
            if (item.getFilename().indexOf('.exe') != -1) {
                updateDownloadIsActive = 1

                item.setSavePath(`${updateFolderPath}${item.getFilename()}`)
                updatePath = `${updateFolderPath}${item.getFilename()}`

                item.on('updated', (e, state) => {
                    if (state == 'interrupted') {
                        if (updateRetry == 5) {
                            item.cancel()
                        } else {
                            item.resume()
                            updateRetry++
                        }
                    } else if (state === 'progressing') {
                        let percent = (item.getReceivedBytes() / item.getTotalBytes()) * 100

                        if (percent != 100) percent = Math.round(percent)

                        updatePercent = percent

                        BrowserWindow.getAllWindows().forEach(window => window.webContents.send('update', updatePercent))
                    }
                })

                item.once('done', (e, state) => {
                    if (state == 'completed') {
                        updateDownloadIsFinish = 1
                    }

                    updateDownloadIsActive = 0
                })

                if (thisUpdate == item.getFilename()) {
                    item.cancel()
                } else {
                    BrowserWindow.getAllWindows().forEach(window => window.webContents.send('update', updatePercent))
                }
            } else {
                updateDownloadIsActive = 0
            }
        })
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            quit()
        }
    })

    app.on('activate', () => {
        activating()
    })

    app.on('browser-window-focus', (e, window) => {
        currentWindow = window
    })
}

module.exports.activating = (url) => {
    activating(url)
}

module.exports.quit = () => {
    BrowserWindow.getAllWindows().forEach((window) => window.close())
}

module.exports.showMenu = () => {
    currentWindow.webContents.send('show-menu')
}

module.exports.showSettings = () => {
    currentWindow.webContents.send('show-settings')
}

ipcMain.on('reset-parameter-file', () => {
    parameterFile = JSON.parse(defaultParameterFile)

    BrowserWindow.getAllWindows().forEach(window => window.webContents.send('parameter-file', parameterFile))
})

ipcMain.on('new-parameter-file', (e, file) => {
    if (parameterFile['lang'] != file['lang']) buildMenu(file['lang'])

    parameterFile = file

    BrowserWindow.getAllWindows().forEach(window => window.webContents.send('parameter-file', parameterFile))
})

ipcMain.on('new-window-file', (e, file) => {
    windowFile = file
})

ipcMain.on('new-window', () => {
    activating()
})