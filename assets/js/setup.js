ipcRenderer.on('parameter-file', (e, file) => {
    if (file != parameterFile) {
        parameterFile = file

        if (firstParameterFileSet == 0) {
            firstParameterFileSet = 1

            setParameterFile()
        } else {
            reloadParameterFile()
        }
    }
})

function setParameterFile() {
    if (importHaveFinished == 1) {
        if (intervalParameter !== undefined) clearInterval(intervalParameter)

        applyChangeLang(parameterFile['lang'])

        //electronContextMenu(contextMenuProcess.template(parameterFile['lang']))

        canSendParameterFile = 1
    } else {
        intervalParameter = setInterval(setParameterFile, 250)
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

        setWindowFile()
    }
})

function setWindowFile() {
    if (windowFile['maximized'] == 1) maximizeWin()
    if (windowFile['pin'] == 1) pinWin()

    canSendWindowFile = 1
}

ipcRenderer.on('recent-file', (e, file) => {
    if (JSON.stringify(recentFile) != JSON.stringify(file)) {
        recentFile = file
    }
})

$('button').keyup((e) => {
    if (e.which == 13) e.preventDefault()
    if (e.which == 32) e.preventDefault()
})

$('a').click((e) => {
    e.preventDefault()
})

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