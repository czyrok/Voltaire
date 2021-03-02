setInterval(checkCreateLine, 50)

function sendNewParameterFile() {
    if (canSendParameterFile == 1) {
        if (parameterFile['lang'] != appLang) {
            parameterFile['lang'] = appLang

            ipcRenderer.send('new-parameter-file', parameterFile)
        }
    }
}

setInterval(sendNewParameterFile, 200)

function sendNewWindowFile() {
    if (canSendWindowFile == 1) {
        if (
            windowFile['dimension']['width'] != win.getNormalBounds().width
            || windowFile['dimension']['height'] != win.getNormalBounds().height
            || windowFile['position']['x'] != win.getNormalBounds().x
            || windowFile['position']['y'] != win.getNormalBounds().y
            || windowFile['maximized'] != winIsMaximized
            || windowFile['pin'] != winAlwaysOnTop
        ) {
            windowFile['dimension']['width'] = win.getNormalBounds().width
            windowFile['dimension']['height'] = win.getNormalBounds().height
            windowFile['position']['x'] = win.getNormalBounds().x
            windowFile['position']['y'] = win.getNormalBounds().y
            windowFile['maximized'] = winIsMaximized
            windowFile['pin'] = winAlwaysOnTop

            ipcRenderer.send('new-window-file', windowFile)
        }
    }
}

setInterval(sendNewWindowFile, 200)

function detectIfWinIsMaximized() {
    if (win.isMaximized() === true && winIsMaximized == 0) {

        winIsMaximized = 1
    } else if (win.isMaximized() === false && winIsMaximized == 1) {

        winIsMaximized = 0
    }
}

setInterval(detectIfWinIsMaximized, 200)