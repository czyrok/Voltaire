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

    $('#file-2').scroll(() => {
        changeScroll()
    })

    $('#file-3').scroll(() => {
        changeScroll()
    })

    file = {
        '1': {
            'global': {
                'li': 1,
                'col': 1
            },
            'selection': {
                'type': undefined,
                'length': 0
            }
        },
        '2': {
            'global': {
                'li': 1,
                'col': 1
            },
            'selection': {
                'type': undefined,
                'length': 0
            }
        },
        '3': {
            'global': {
                'li': 1,
                'col': 1
            },
            'selection': {
                'type': undefined,
                'length': 0
            }
        }
    }

    setInterval(detectNewAlert, 200)

    setInterval(sendNewParameterFile, 200)
    setInterval(sendNewWindowFile, 200)
    setInterval(detectIfWinIsMaximized, 200)

    require(['vs/editor/editor.main'], function () {
        monaco.editor.defineTheme('dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { background: cssConfig.global.colors.a }
            ],
            colors: {
                'focusBorder': cssConfig.global.selection.active,
                'foreground': cssConfig.global.colors.e,
                'editorCursor.foreground': cssConfig.global.colors.e,
                'editorLineNumber.foreground': cssConfig.global.colors.c,

                'editor.selectionBackground': cssConfig.global.selection.active,
                'editor.inactiveSelectionBackground': cssConfig.global.selection.inactive,
                'editor.background': cssConfig.global.colors.a,

                'editorWidget.background': cssConfig.global.colors.c,
                'editorWidget.border': cssConfig.global.colors.d,
                'editorHoverWidget.background': cssConfig.global.colors.c,
                'editorHoverWidget.border': cssConfig.global.colors.d,

                'dropdown.background': cssConfig.global.colors.c,
                'dropdown.foreground': cssConfig.global.colors.e,
                'dropdown.border': cssConfig.global.colors.d,

                'list.activeSelectionBackground': cssConfig.global.selection.active,
                'list.activeSelectionForeground': cssConfig.global.colors.e,
                'list.inactiveSelectionBackground': cssConfig.global.selection.inactive,
                'list.inactiveSelectionForeground': cssConfig.global.colors.e,
                'list.highlightForeground': cssConfig.global.selection.highlight,

                'list.hoverBackground': cssConfig.global.selection.highlight,
                'list.hoverForeground': cssConfig.global.colors.e,
                'list.focusBackground': cssConfig.global.colors.b,
                'list.focusForeground': cssConfig.global.colors.e,

                'input.background': cssConfig.global.colors.a,
                'input.foreground': cssConfig.global.colors.e,
                'input.border': cssConfig.global.colors.a,
                'input.placeholderForeground': cssConfig.global.colors.d
            }
        })
        monaco.editor.setTheme('dark')

        editor = monaco.editor.create(document.getElementById('file-1'), {
            value: "function hello() {\n\talert('Hello world!');\n}",
            language: "javascript",
            fontFamily: cssConfig.global.fonts.a,
            fontSize: 14,
            scrollbar: {
                vertical: 'hidden',
                horizontal: 'auto',
                verticalScrollbarSize: 0,
                horizontalScrollbarSize: cssConfig.global.scrollBar.size,
            }
        })

        //monaco.editor.setModelLanguage(editor.getModel(), 'fr')

        console.log(editor.getValue())
        console.log(editor.getPosition())
        //console.log(editor.getSelection().containsRange())

        window.onresize = function () {
            if (editor) {
                editor.layout()
            }
        }
    })
}