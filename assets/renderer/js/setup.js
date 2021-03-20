setupInterval = setInterval(() => {
    if (importHaveFinished == 1) {
        clearInterval(setupInterval)

        setEvents()
    }
}, 250)

ipcRenderer.on('parameter-file', (e, file) => {
    if (file != parameterFile) {
        parameterFile = file

        if (firstParameterFileSet == 0) {
            firstParameterFileSet = 1

            parameterInterval = setInterval(setParameterFile, 250)
        } else {
            reloadParameterFile()
        }
    }
})

function setParameterFile() {
    if (importHaveFinished == 1) {
        clearInterval(parameterInterval)

        applyChangeLang(parameterFile['lang'])

        canSendParameterFile = 1
    }
}

function reloadParameterFile() {
    if (parameterFile['lang'] != appLang) {
        applyChangeLang(parameterFile['lang'])
    }
}

ipcRenderer.on('window-file', (e, file) => {
    windowFile = file

    if (firstWindowFileSet == 0) {
        firstWindowFileSet = 1

        windowInterval = setInterval(setWindowFile, 250)
    }
})

function setWindowFile() {
    if (importHaveFinished == 1) {
        clearInterval(windowInterval)

        if (windowFile['maximized'] == 1) maximizeWin()
        if (windowFile['pin'] == 1) pinWin()

        canSendWindowFile = 1
    }
}

ipcRenderer.on('recent-file', (e, file) => {
    if (JSON.stringify(recentFile) != JSON.stringify(file)) {
        recentFile = file
    }
})

function setEvents() {
    document.addEventListener('wheel', (e) => {
        if (menuIsShowed == 0 && $('#tab-area:hover').length > 0) {
            if (e.deltaY < 0) {
                byID('tab-area').scrollBy(-30, 0)
            } else {
                byID('tab-area').scrollBy(30, 0)
            }
        }
    })

    document.addEventListener('paste', (e) => {
        if (paste == 1) return paste = 0
        paste = 1

        let pastedText = (e.clipboardData || window.clipboardData).getData('text')

        navigator.clipboard.writeText(pastedText).then(() => {
            document.execCommand('paste')
        })

        e.preventDefault()
    })

    $('button').keyup((e) => {
        if (e.which == 13) e.preventDefault()
        if (e.which == 32) e.preventDefault()
    })

    $('a').click((e) => {
        e.preventDefault()
    })

    $('#text-area').scroll(() => {
        $('#code-line-bar').scrollTop($('#text-area').scrollTop())

        lastScrollTop = $('#text-area').scrollTop()
    })

    setInterval(updateCodeLineBarNum, 50)
    setInterval(liColTextArea, 50)

    setInterval(sendNewParameterFile, 200)
    setInterval(sendNewWindowFile, 200)
    setInterval(detectIfWinIsMaximized, 200)
}