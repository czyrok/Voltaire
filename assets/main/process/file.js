const fs = require('fs'),

    globalProcess = require('./global.js')

module.exports.saveFiles = async () => {
    globalProcess.mkDir(globalProcess.storageFolderPath)

    fs.writeFile(globalProcess.parameterFilePath, JSON.stringify(globalProcess.parameterFile), (error) => {
        if (error) console.error(error)

        globalProcess.savedFilesCount++
    })

    fs.writeFile(globalProcess.windowFilePath, JSON.stringify(globalProcess.windowFile), (error) => {
        if (error) console.error(error)

        globalProcess.savedFilesCount++
    })

    fs.writeFile(globalProcess.recentFilePath, JSON.stringify(globalProcess.recentFile), (error) => {
        if (error) console.error(error)

        globalProcess.savedFilesCount++
    })
}

module.exports.parameterFileReading = () => {
    fs.readFile(globalProcess.parameterFilePath, (error, readParameterFile) => {
        if (error) console.error(error)

        if (readParameterFile === undefined) {
            globalProcess.parameterFile = JSON.parse(globalProcess.defaultParameterFile)

            globalProcess.firstReadFiles.push(JSON.parse(globalProcess.defaultParameterFile))
        } else if (globalProcess.isValidJSON(readParameterFile) === true) {
            globalProcess.parameterFile = JSON.parse(readParameterFile)

            globalProcess.firstReadFiles.push(JSON.parse(readParameterFile))
        } else {
            return parameterFileReading()
        }

        globalProcess.buildWindowMenu(globalProcess.parameterFile['lang'])

        globalProcess.recoveredFilesCount++
    })
}

module.exports.windowFileReading = () => {
    fs.readFile(globalProcess.windowFilePath, (error, readWindowFile) => {
        if (error) console.error(error)

        if (readWindowFile === undefined) {
            globalProcess.windowFile = JSON.parse(globalProcess.defaultWindowFile)

            globalProcess.firstReadFiles.push(JSON.parse(globalProcess.defaultWindowFile))
        } else if (globalProcess.isValidJSON(readWindowFile) === true) {
            globalProcess.windowFile = JSON.parse(readWindowFile)

            globalProcess.firstReadFiles.push(JSON.parse(readWindowFile))
        } else {
            return windowFileReading()
        }

        globalProcess.setWindowSettings()

        globalProcess.recoveredFilesCount++
    })
}

module.exports.recentFileReading = () => {
    fs.readFile(globalProcess.recentFilePath, (error, readRecentFile) => {
        if (error) console.error(error)

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