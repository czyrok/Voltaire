window.$ = window.jQuery = require('jquery')

const { ipcRenderer, shell } = require('electron'),
    fs = require('fs'),
    electronContextMenu = require('electron-context-menu'),
    dragula = require('dragula'),
    langProcess = require('../../process/lang.js'),
    contextMenuProcess = require('../../process/menu/context.js'),

    win = require('electron').remote.getCurrentWindow(),

    app = require('electron').remote.app,
    appVersion = app.getVersion(),
    appName = app.getName(),
    appAuthor = 'czyrok'

let // global settings
    updateDownloadIsActive = 0,
    importHaveFinished = 0,
    paste = 0,
    setupInterval,

    // updateCodeLineBarNum()
    linesCount = 0,
    lastLineTop = 0,
    lastInnerHTMLTextArea,
    lastScrollTop,

    // liColTextArea()
    lastCurrentLine,
    lastTextAreaRange,
    textAreaLineHeight = 22, // px

    // parameter file
    parameterFile,
    firstParameterFileSet = 0,
    canSendParameterFile = 0,
    parameterInterval,

    // window file
    windowFile,
    firstWindowFileSet = 0,
    canSendWindowFile = 0,
    windowInterval,

    // recent file
    recentFile,

    // window settings
    winIsMaximized = 0,
    winAlwaysOnTop = 0,
    appLang,

    // dialog settings
    menuIsShowed = 0,
    settingsAreShowed = 0,
    updateIsShowed = 0,

    // tab settings
    currentActiveTab,
    currentSettingsCategoryContent

console.log(`[${appName}/${appVersion}]`)

function byID(id) {
    return document.getElementById(id)
}

function qSelect(selector) {
    return document.querySelector(selector)
}

/* const cp = require('child_process')

var child = cp.exec("cd C:\\Users\\czyro\\Disque nuagique\\Fichiers\\Projets\\App\\Synoko && node app", function (error, stdout) {
    if (error) console.error(error.code)
})

child.stdout.on('data', (chunk) => {
    console.log(chunk)
});

const psTree = require('ps-tree')

function trucc() {
    psTree(child.pid, function (error, children) {
        children.map(function (p) {
            process.kill(p.PID)
        })
    })
} */