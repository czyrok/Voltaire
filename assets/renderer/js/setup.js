setupInterval = setInterval(() => {
    if (HTMLImportHaveFinished == 1) {
        clearInterval(setupInterval)

        setEvents()

        ipcRenderer.send('ready')
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
    if (HTMLImportHaveFinished == 1) {
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
    if (HTMLImportHaveFinished == 1) {
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
    qSelectAll('button').forEach(btn => {
        btn.addEventListener('click', function (e) {
            let rect = e.target.getBoundingClientRect()
            let x = e.clientX - rect.left
            let y = e.clientY - rect.top

            let ripples = document.createElement('span')
            ripples.style.left = x + 'px'
            ripples.style.top = y + 'px'

            this.appendChild(ripples)

            setTimeout(() => {
                ripples.remove()
            }, 700)
        })
    })

    if (!darwin) {
        document.addEventListener('wheel', (e) => {
            if (menuIsShowed == 0 && $('#main-tab-area:hover').length > 0) {
                if (e.deltaY < 0) {
                    byID('main-tab-area').scrollBy(-30, 0)
                } else {
                    byID('main-tab-area').scrollBy(30, 0)
                }
            }
        })
    }

    document.addEventListener('paste', (e) => {
        e.preventDefault()

        let pastedText = (e.clipboardData || window.clipboardData).getData('text/plain'),
            pastedLines = pastedText.split('\n'),

            caretPosition = $(`#file-${currentFileNum}`).caret('pos') - file[currentFileNum.toString()]['selection']['length'],
            breakDownCount = file[currentFileNum.toString()]['selection']['content'].split('\n').length

        document.execCommand('insertText', true, pastedText)

        repairContentEditable(byID(`file-${currentFileNum}`), 1)

        if (pastedLines.length > 1) {
            let i,
                difference = 1

            for (i = 0; i < pastedLines.length - 1; i++) {
                difference++
            }

            $(`#file-${currentFileNum}`).caret('pos', caretPosition + pastedText.length + breakDownCount - difference)
        } else if (breakDownCount > 1) {
            $(`#file-${currentFileNum}`).caret('pos', caretPosition + pastedText.length + breakDownCount - 1)
        } else {
            $(`#file-${currentFileNum}`).caret('pos', caretPosition + pastedText.length)
        }
    })

    $('button').keyup((e) => {
        if (e.which == 13) e.preventDefault()
        if (e.which == 32) e.preventDefault()
    })

    $('a').click((e) => {
        e.preventDefault()
    })

    $('#file-1').scroll(() => {
        changeScroll()
    })

    /* byID('file-1').addEventListener('input', (event) => {        
        byID('copie').innerHTML = byID(`file-${currentFileNum}`).innerHTML

        hljs.highlightElement(byID('copie'))

        $('#copie').scrollTop($(`#file-${currentFileNum}`).scrollTop())
    }) */

    $('#file-2').scroll(() => {
        changeScroll()
    })

    $('#file-3').scroll(() => {
        changeScroll()
    })

    file = {
        '1': {
            'global': {
                'ready': 1,
                'li': 1,
                'end': 1,
                'col': 1,
                'elements': undefined
            },
            'selection': {
                'focusNode': undefined,
                'focusOffset': undefined,
                'anchorNode': undefined,
                'anchorOffset': undefined,
                'type': undefined,
                'length': 0,
                'content': undefined
            },
            'scroll': {
                'top': 0,
                'left': 0
            }
        },
        '2': {
            'global': {
                'ready': 1,
                'li': 1,
                'end': 1,
                'col': 1,
                'elements': undefined
            },
            'selection': {
                'focusNode': undefined,
                'focusOffset': undefined,
                'anchorNode': undefined,
                'anchorOffset': undefined,
                'type': undefined,
                'length': 0,
                'content': undefined
            },
            'scroll': {
                'top': 0,
                'left': 0
            }
        },
        '3': {
            'global': {
                'ready': 1,
                'li': 1,
                'end': 1,
                'col': 1,
                'elements': undefined
            },
            'selection': {
                'focusNode': undefined,
                'focusOffset': undefined,
                'anchorNode': undefined,
                'anchorOffset': undefined,
                'type': undefined,
                'length': 0,
                'content': undefined
            },
            'scroll': {
                'top': 0,
                'left': 0
            }
        }
    }

    setInterval(updateContentEditable, 200)

    setInterval(detectNewAlert, 200)

    setInterval(sendNewParameterFile, 200)
    setInterval(sendNewWindowFile, 200)
    setInterval(detectIfWinIsMaximized, 200)
}