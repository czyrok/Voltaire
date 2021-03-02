window.$ = window.jQuery = require('jquery')

const { ipcRenderer, shell } = require('electron'),
    fs = require('fs'),
    electronContextMenu = require('electron-context-menu'),
    dragula = require('dragula'),
    langInterfaceProcess = require('../interface/lang.js'),
    contextMenuProcess = require('../menu/context.js'),

    win = require('electron').remote.getCurrentWindow(),

    app = require('electron').remote.app,
    appVersion = app.getVersion(),
    appName = app.getName(),
    appAuthor = 'czyrok'

let updateDownloadIsActive = 0,
    importHaveFinished = 0,
    paste = 0,

    linesCount = 0,
    lastLineTop = 0,
    lastTextArea,
    lastWinWidth,

    parameterFile,
    firstParameterFileSet = 0,
    canSendParameterFile = 0,
    intervalParameter,

    windowFile,
    firstWindowFileSet = 0,
    canSendWindowFile = 0,

    recentFile,

    winIsMaximized = 0,
    winAlwaysOnTop = 0,
    appLang,

    menuIsShowed = 0,
    settingsAreShowed = 0,
    updateIsShowed = 0,

    currentActiveTab,
    currentSettingsCategoryContent