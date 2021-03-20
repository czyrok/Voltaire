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

byID('settings.lady')

function applyChangeLang(language) {
    if (appLang != language) {
        if (appLang !== undefined) delete electronContextMenu()
        electronContextMenu(contextMenuProcess.template(language))

        byID('interface.menu.title').textContent = langProcess.lang[language]['interface']['menu']['title']

        byID('settings.lang.category').textContent = langProcess.lang[language]['settings']['lang']['category']
        byID('settings.lang.title').textContent = langProcess.lang[language]['settings']['lang']['title']

        byID('settings.settings.category').textContent = langProcess.lang[language]['settings']['settings']['category']
        byID('settings.settings.title').textContent = langProcess.lang[language]['settings']['settings']['title']
        byID('settings.settings.reset').textContent = langProcess.lang[language]['settings']['settings']['reset']

        byID('interface.update').textContent = langProcess.lang[language]['interface']['update']

        byID(language).checked = true

        appLang = language
    }
}

function showRemoveMenu() {
    if (menuIsShowed == 0) {
        byID('menu').style.animation = 'showMenu 0.5s ease forwards'
        byID('main').style.animation = 'removeMain 0.5s ease forwards'

        menuIsShowed = 1
    } else {
        byID('menu').style.animation = 'removeMenu 0.5s ease forwards'
        byID('main').style.animation = 'showMain 0.5s ease forwards'

        menuIsShowed = 0
    }
}

function showSettings() {
    if (canSendParameterFile == 1) {
        if (settingsAreShowed == 0) {
            setActiveSettingsCategoryContent('lang-category-content')

            byID('default').checked = true

            byID('settings').style.animation = 'showSettings 0.5s ease forwards'

            settingsAreShowed = 1
        }
    }
}

function removeSettings() {
    if (settingsAreShowed == 1) {
        byID('settings').style.animation = 'removeSettings 0.3s ease forwards'

        settingsAreShowed = 0
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

function setActiveTab(id) {
    if (currentActiveTab !== undefined) {
        byID(currentActiveTab).removeAttribute('active')
    }

    byID(id).setAttribute('active', 'true')

    currentActiveTab = id
}

function setActiveSettingsCategoryContent(id) {
    if (currentSettingsCategoryContent !== undefined) {
        byID(currentSettingsCategoryContent).removeAttribute('active')
    }

    byID(id).setAttribute('active', 'true')

    currentSettingsCategoryContent = id
}

function createLine(e) {
    if (e && e.offsetTop == lastLineTop && linesCount >= 1) return

    linesCount++

    let div = document.createElement('div')
    div.setAttribute('id', linesCount)
    div.textContent = linesCount
    byID('code-line-bar').appendChild(div)

    $('#code-line-bar').scrollTop(lastScrollTop)

    if (e) {
        lastLineTop = e.offsetTop

        liColTextArea(true)
    } else {
        lastLineTop = 0

        byID(`${linesCount}`).setAttribute('active', 'true')
    }
}

function setActiveCurrentLine(line) {
    if (byID(`${line}`)) {
        if (lastCurrentLine !== undefined && byID(`${lastCurrentLine}`)) byID(`${lastCurrentLine}`).removeAttribute('active')

        byID(`${line}`).setAttribute('active', 'true')

        lastCurrentLine = line
    }
}