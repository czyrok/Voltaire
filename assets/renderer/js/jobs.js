function sendNewParameterFile() {
    if (canSendParameterFile == 1) {
        if (parameterFile['lang'] != appLang) {
            parameterFile['lang'] = appLang

            ipcRenderer.send('new-parameter-file', parameterFile)
        }
    }
}

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

function detectIfWinIsMaximized() {
    if (win.isMaximized() === true && winIsMaximized == 0) {

        winIsMaximized = 1
    } else if (win.isMaximized() === false && winIsMaximized == 1) {

        winIsMaximized = 0
    }
}

function detectNewAlert() {
    if (newAlertList.length > 0 && alertTimeout === undefined) {
        alertTimeout = setTimeout(cancelAlert, 5e3)

        showAlert(newAlertList[0]['text'], newAlertList[0]['color'])

        newAlertList.splice(0, 1)
    }
}

track(qSelect('#tracked'), {
    callback(selection) {
        let characters = selection.toString().split(''),
            currentFile = file[currentFileNum.toString()]

        currentFile['selection']['type'] = selection.type
        currentFile['selection']['length'] = characters.length

        byID('select-count').textContent = characters.length

        if (selection.type == 'Range') {
            byID('li-num').style.display = 'none'
            byID('col-num').style.display = 'none'
            byID('selection').style.display = 'flex'
        } else {
            byID('li-num').style.display = ''
            byID('col-num').style.display = ''
            byID('selection').style.display = ''
        }
    },
    trackDynamically: true,
    trackMouse: true,
    trackPointer: true,
    trackKeyBoard: true,
    trackTouch: true,
    subscribeToDocument: true
})