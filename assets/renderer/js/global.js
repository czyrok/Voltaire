window.$ = window.jQuery = require('jquery')

const { ipcRenderer, shell } = require('electron'),
    fs = require('fs'),
    ejs = require('ejs'),
    { track, select, selectOnly, removeAllSelection, getSelectionInsideNode } = require('selection-range-enhancer'),
    caret = require('jquery.caret'),
    dragula = require('dragula'),
    prism = require('prismjs'),

    darwin = process.platform === 'darwin',
    win = require('electron').remote.getCurrentWindow(),
    app = require('electron').remote.app,
    appVersion = app.getVersion(),
    appName = app.getName(),

    langConfig = require('../../config/lang-config.json'),
    cssConfig = require('../../config/css-config.json')

let // global settings
    editor,
    
    updateDownloadIsActive = 0,
    HTMLImportHaveFinished = 0,
    paste = 0,
    setupInterval,
    appLang,
    defaultLanguage = 'en',

    file = {},

    // code lines bar settings
    lastCurrentLinesSet = [],

    // content editable settings
    textInContentEditable = 0,

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

    // dialog settings
    menuIsShowed = 0,
    alertAreShowed = 0,
    updateIsShowed = 0,

    // tab settings
    currentFileNum = 1,

    // menu settings
    defaultMenu = 'recent-files',
    currentMenu = defaultMenu,

    // alert settings
    newAlertList = [],
    alertTimeout,

    // import settings
    HTMLImportLinks = qSelectAll('link[rel="import/html"]'),
	HTMLImportedFilesCount = 0,

	CSSImportLinks = qSelectAll('link[rel="import/css"]'),
	CSSImportedFilesCount = 0

console.log(`[${appName}/${appVersion}]`)

function byID(id) {
    return document.getElementById(id)
}

function qSelect(selector) {
    return document.querySelector(selector)
}

function qSelectAll(selector) {
    return document.querySelectorAll(selector)
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