const { screen } = require('electron'),
    fs = require('fs'),

    globalProcess = require('./global.js')

module.exports.saveFiles = () => {
    globalProcess.mkDir(globalProcess.storageFolderPath)

    fs.writeFile(globalProcess.parameterFilePath, JSON.stringify(globalProcess.parameterFile), (err) => {
        if (err) console.error(err)

        globalProcess.savedFilesCount++
    })

    fs.writeFile(globalProcess.windowFilePath, JSON.stringify(globalProcess.windowFile), (err) => {
        if (err) console.error(err)

        globalProcess.savedFilesCount++
    })

    fs.writeFile(globalProcess.recentFilePath, JSON.stringify(globalProcess.recentFile), (err) => {
        if (err) console.error(err)

        globalProcess.savedFilesCount++
    })
}

module.exports.parameterFileReading = () => {
    fs.readFile(globalProcess.parameterFilePath, (err, readParameterFile) => {
        if (err) console.error(err)

        if (readParameterFile === undefined) {
            globalProcess.parameterFile = JSON.parse(globalProcess.defaultParameterFile)

            globalProcess.firstReadFiles.push(JSON.parse(globalProcess.defaultParameterFile))
        } else if (globalProcess.isValidJSON(readParameterFile) === true) {
            globalProcess.parameterFile = JSON.parse(readParameterFile)

            globalProcess.firstReadFiles.push(JSON.parse(readParameterFile))
        } else {
            return parameterFileReading()
        }

        globalProcess.buildMenu(globalProcess.parameterFile['lang'])

        globalProcess.recoveredFilesCount++
    })
}

module.exports.windowFileReading = () => {
    fs.readFile(globalProcess.windowFilePath, (err, readWindowFile) => {
        if (err) console.error(err)

        if (readWindowFile === undefined) {
            globalProcess.windowFile = JSON.parse(globalProcess.defaultWindowFile)

            globalProcess.firstReadFiles.push(JSON.parse(globalProcess.defaultWindowFile))
        } else if (globalProcess.isValidJSON(readWindowFile) === true) {
            globalProcess.windowFile = JSON.parse(readWindowFile)

            globalProcess.firstReadFiles.push(JSON.parse(readWindowFile))
        } else {
            return windowFileReading()
        }

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
            globalProcess.x = Math.round(widthScreen / 2 - width / 2)
            globalProcess.y = Math.round(heightScreen / 2 - height / 2)

            globalProcess.windowFile['position']['x'] = globalProcess.x
            globalProcess.windowFile['position']['y'] = globalProcess.y
        } else {
            globalProcess.x = Math.round(globalProcess.windowFile['position']['x'])
            globalProcess.y = Math.round(globalProcess.windowFile['position']['y'])
        }

        globalProcess.recoveredFilesCount++
    })
}

module.exports.recentFileReading = () => {
    fs.readFile(globalProcess.recentFilePath, (err, readRecentFile) => {
        if (err) console.error(err)

        if (readRecentFile === undefined) {
            globalProcess.recentFile = JSON.parse(globalProcess.defaultRecentFile)

            globalProcess.firstReadFiles.push(JSON.parse(globalProcess.defaultRecentFile))
        } else if (globalProcess.isValidJSON(readRecentFile) === true) {
            globalProcess.recentFile = JSON.parse(readRecentFile)

            globalProcess.firstReadFiles.push(JSON.parse(readRecentFile))
        } else {
            return recentFileReading()
        }

        globalProcess.recoveredFilesCount++
    })
}