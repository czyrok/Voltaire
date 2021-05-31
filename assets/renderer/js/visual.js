function maximizeWin() {
    if (win.isMaximized() === true) {
        win.unmaximize()

        winIsMaximized = 0
    } else {
        win.maximize()

        winIsMaximized = 1
    }
}

function pinWin() {
    if (win.isAlwaysOnTop() === true) {
        win.setAlwaysOnTop(false)

        winAlwaysOnTop = 0
    } else {
        win.setAlwaysOnTop(true)

        winAlwaysOnTop = 1
    }
}

function applyChangeLang(language) {
    if (language === undefined) language = byID('select-lang').value

    if (language != appLang) {
        byID('interface.menu.recent-files').textContent = langConfig[language]['interface']['menu']['recent-files']
        byID('interface.menu.settings').textContent = langConfig[language]['interface']['menu']['settings']

        byID('settings.lang.title').textContent = langConfig[language]['settings']['lang']['title']

        byID('settings.settings.title').textContent = langConfig[language]['settings']['settings']['title']
        byID('settings.settings.reset').textContent = langConfig[language]['settings']['settings']['reset']

        byID('interface.update').textContent = langConfig[language]['interface']['update']

        byID('interface.message-bar.selection').textContent = langConfig[language]['interface']['message-bar']['selection']

        byID(language).selected = true

        appLang = language
    }
}

function showMenu(showSettings) {
    if (menuIsShowed == 0) {
        if (showSettings === true) {
            setMenuActiveTab('settings')
        } else {
            setMenuActiveTab(defaultMenu)
        }

        byID('menu').style.animation = 'showMenu 0.5s ease forwards'

        byID('main').style.animation = 'removeMain 0.5s ease forwards'
        byID('li-col-selection').style.animation = 'removeLiColSelect 0.5s ease forwards'

        byID('main-background').style.display = 'block'
        byID('main-background').style.animation = 'showMainBackground 0.5s ease forwards'

        menuIsShowed = 1
    } else if (showSettings === true) {
        setMenuActiveTab('settings')
    } else {
        setMenuActiveTab(defaultMenu)
    }
}

function removeMenu() {
    if (menuIsShowed == 1) {
        byID('menu').style.animation = 'removeMenu 0.5s ease forwards'

        byID('main').style.animation = 'showMain 0.5s ease forwards'
        byID('li-col-selection').style.animation = 'showLiColSelect 0.5s ease forwards'

        byID('main-background').style.animation = 'removeMainBackground 0.5s ease forwards'
        setTimeout(() => {
            byID('main-background').style.display = 'none'
        }, 500)

        menuIsShowed = 0
    }
}

function showAlert(text, color) {
    if (alertAreShowed == 0) {
        byID('alert-text').textContent = text

        byID('alert').style.animation = 'showAlert 0.5s ease forwards'
        byID('alert').setAttribute('color', color)

        alertAreShowed = 1
    }
}

function removeAlert() {
    if (alertAreShowed == 1) {
        byID('alert').style.animation = 'removeAlert 0.3s ease forwards'

        alertAreShowed = 0
    }
}

function showRemoveUpdate() {
    if (updateIsShowed == 0) {
        byID('update').style.animation = 'showUpdate 0.5s ease forwards'

        updateIsShowed = 1
    } else {
        byID('update').style.animation = 'removeUpdate 0.3s ease forwards'

        updateIsShowed = 0
    }
}

function setActiveTab(num) {
    if (currentFileNum !== undefined) {
        byID(`tab-${currentFileNum}`).removeAttribute('active')
        byID(`file-${currentFileNum}`).removeAttribute('active')
    }

    file[currentFileNum.toString()]['global']['ready'] = 0

    byID(`tab-${num}`).setAttribute('active', 'true')
    byID(`tab-${num}-input`).checked = true

    byID(`file-${num}`).setAttribute('active', 'true')
    byID(`file-${num}`).focus()

    currentFileNum = num

    let currentFile = file[currentFileNum.toString()]

    //updateCodeLinesAndSelection(true)

    if (currentFile['selection']['focusNode'] !== undefined) {
        window.getSelection().setBaseAndExtent(
            currentFile['selection']['focusNode'],
            currentFile['selection']['focusOffset'],
            currentFile['selection']['anchorNode'],
            currentFile['selection']['anchorOffset']
        )
    }

    $(`#file-${currentFileNum}`).scrollTop(currentFile['scroll']['top'])
    $(`#file-${currentFileNum}`).scrollLeft(currentFile['scroll']['left'])

    byID('select-count').textContent = currentFile['selection']['length']

    currentFile['global']['ready'] = 1
}

function setMenuActiveTab(name) {
    byID(`${currentMenu}-tab`).removeAttribute('active')
    byID(`${currentMenu}-page`).removeAttribute('active')

    byID(`${name}-tab`).setAttribute('active', 'true')
    byID(`${name}-tab-input`).checked = true

    byID(`${name}-page`).setAttribute('active', 'true')

    currentMenu = name
}

function setActiveLine(line) {
    if (byID(line.toString())) {
        byID(line.toString()).setAttribute('active', 'true')

        lastCurrentLinesSet.push(line)
    }
}

function unsetLastActiveLines() {
    if (lastCurrentLinesSet.length > 0) {
        while (lastCurrentLinesSet.length > 0) {
            if (byID(`${lastCurrentLinesSet[0]}`)) byID(`${lastCurrentLinesSet[0]}`).removeAttribute('active')

            lastCurrentLinesSet.splice(0, 1)
        }
    }
}

function updateCodeLinesAndSelection(forcedLaunch) {
    if (forcedLaunch === true) updateElementsList()

    let currentFile = file[currentFileNum.toString()],
        linesCount = 1

    byID('main-code-line-bar').innerHTML = ''

    if (currentFile['global']['elements'].length == 0) {
        let div = document.createElement('div')
        div.setAttribute('id', linesCount)
        div.textContent = linesCount

        byID('main-code-line-bar').appendChild(div)

        linesCount++
    } else {
        currentFile['global']['elements'].forEach((element) => {
            let div = document.createElement('div')
            div.setAttribute('id', linesCount)
            div.setAttribute('style', `height: ${$(element).height()}px`)
            div.textContent = linesCount

            byID('main-code-line-bar').appendChild(div)

            linesCount++
        })
    }

    unsetLastActiveLines()

    if (currentFile['selection']['type'] == 'Range') {
        setActiveLine(currentFile['global']['li'])
        setActiveLine(currentFile['global']['end'])

        byID('li-num').style.display = 'none'
        byID('col-num').style.display = 'none'
        byID('selection').style.display = 'flex'
    } else {
        setActiveLine(currentFile['global']['li'])

        byID('li-num').style.display = ''
        byID('col-num').style.display = ''
        byID('selection').style.display = ''
    }

    $('#main-code-line-bar').scrollTop(currentFile['scroll']['top'])
}

function changeScroll() {
    let top = $(`#file-${currentFileNum}`).scrollTop(),
        left = $(`#file-${currentFileNum}`).scrollLeft()

    $('#main-code-line-bar').scrollTop(top)
    $('#copie').scrollTop(top)

    file[currentFileNum.toString()]['scroll']['top'] = top
    file[currentFileNum.toString()]['scroll']['left'] = left
}