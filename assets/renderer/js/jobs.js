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

function updateCodeLineBarNum() {
    let divList = byID('text-area').querySelectorAll('div')

    if (byID('text-area').innerHTML != lastInnerHTMLTextArea) {
        lastInnerHTMLTextArea = byID('text-area').innerHTML

        linesCount = 0
        byID('code-line-bar').innerHTML = ''

        if (divList.length == 0) createLine()

        Array.prototype.forEach.call(divList, (e) => {
            createLine(e)
        })
    }
}

function liColTextArea(forceLaunch) {
    if ($('#text-area').is(":focus")) {
        let textAreaRange = window.getSelection().getRangeAt(0)

        if (textAreaRange != lastTextAreaRange || forceLaunch === true) {
            let startSelectionDiv = textAreaRange.startContainer,
                li = 1,
                col = textAreaRange.startOffset + 1

            lastTextAreaRange = textAreaRange

            while (isNaN(startSelectionDiv.offsetTop)) {
                startSelectionDiv = startSelectionDiv.parentNode
            }

            li = (startSelectionDiv.offsetTop / textAreaLineHeight) + 1

            byID('code-line-li').textContent = `Li ${li},`
            if (textAreaRange.startOffset !== undefined) byID('code-line-col').textContent = `col ${col}`

            setActiveCurrentLine(li)
        }
    }
}