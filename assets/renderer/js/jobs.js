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

function detectNewAlert() {
    if (newAlertList.length > 0 && alertTimeout === undefined) {
        alertTimeout = setTimeout(cancelAlert, 5e3)

        showAlert(newAlertList[0]['text'], newAlertList[0]['color'])

        newAlertList.splice(0, 1)
    }
}

function updateContentEditable() {
    let windowSelection = window.getSelection(),
        currentFile = file[currentFileNum.toString()]

    if ($(`#file-${currentFileNum}`).is(":focus") && currentFile['selection']['type'] != 'Range') {
        let caretPosition = $(`#file-${currentFileNum}`).caret('pos')

        repairContentEditable(byID(`file-${currentFileNum}`), 1)

        if (textInContentEditable == 1) {
            $(`#file-${currentFileNum}`).caret('pos', caretPosition)

            textInContentEditable = 0
        }
    }

    updateElementsList()

    if ($(`#file-${currentFileNum}`).is(":focus")) {
        let textAreaRange = windowSelection.getRangeAt(0),
            startSelectionDiv = textAreaRange.startContainer,
            endSelectionDiv = textAreaRange.endContainer,
            count

        currentFile['global']['col'] = textAreaRange.startOffset + 1
        currentFile['global']['li'] = 1
        currentFile['global']['end'] = 1

        while (startSelectionDiv.nodeName != 'DIV') {
            startSelectionDiv = startSelectionDiv.parentNode
        }

        while (endSelectionDiv.nodeName != 'DIV') {
            endSelectionDiv = endSelectionDiv.parentNode
        }

        for (count = 0; count < currentFile['global']['elements'].length; count++) {
            if (currentFile['global']['elements'][count] === startSelectionDiv) {
                currentFile['global']['li'] = count + 1
            }

            if (currentFile['global']['elements'][count] === endSelectionDiv) {
                currentFile['global']['end'] = count + 1
            }
        }

        byID('li-num').textContent = `Li ${currentFile['global']['li']},`
        byID('col-num').textContent = `col ${currentFile['global']['col']}`
    }

    updateCodeLinesAndSelection()
}

function truc() {
    /*     byID('copie').innerHTML = ''
    byID('copie').innerHTML = byID(`file-${currentFileNum}`).innerHTML
 
    hljs.highlightElement(byID('copie'))
 
    $('#copie').scrollTop($(`#file-${currentFileNum}`).scrollTop()) */

    // The code snippet you want to highlight, as a string
    const code = byID(`file-${currentFileNum}`).innerHTML
        .replace(/\n<\/div>/g, '')
        .replace(/<\/div>/g, '')
        .replace(/<br>/g, '')
        .replace(/<div>/i, '')
        .replace(/<div>/g, '\n')

    // Returns a highlighted HTML string
    const html = prism.highlight(code, prism.languages.javascript, 'javascript')

    //byID('copie').textContent = code

    $('#copie').html(html)

    $('#copie').scrollTop($(`#file-${currentFileNum}`).scrollTop())

/*     let childNodesList = byID('copie').childNodes,
        elementCount = 0,

        assembledTextList = [],
        beforeIsText = 0

    childNodesList.forEach((element) => {
        if (element.nodeName == '#text' && element.data != '') {
            console.log(element.textContent)
            let text

            if (element.outerHTML === undefined) {
                text = element.textContent
            } else {
                text = element.outerHTML
            }

            if (beforeIsText == 1) {
                assembledTextList[assembledTextList.length - 1]['text'] = assembledTextList[assembledTextList.length - 1]['text'] + text

                assembledTextList[assembledTextList.length - 1]['remove'].push(element)
            } else {
                assembledTextList.push({
                    'first': element,
                    'text': text,
                    'remove': []
                })
            }

            beforeIsText = 1
            elementCount++
        }
    })

    assembledTextList.forEach((textElement) => {
        textElement['remove'].forEach((element) => {
            byID('copie').removeChild(element)
        })

        let createdDiv = document.createElement('div'),
            separatedText = textElement['text'].split('\n')

        separatedText.forEach((text) => {
            let div = document.createElement('div')
            div.innerHTML = text

            createdDiv.appendChild(div)
        })

        byID('copie').appendChild(createdDiv)
        byID('copie').replaceChild(createdDiv, textElement['first'])
    }) */
}

track(qSelect('#tracked'), {
    callback(selection) {
        if ($(`#file-${currentFileNum}`).is(":focus")) {
            let characters = selection.toString().split(''),
                currentFile = file[currentFileNum.toString()]

            byID('select-count').textContent = characters.length

            if (currentFile['global']['ready'] == 1) {
                currentFile['selection']['focusNode'] = selection.focusNode
                currentFile['selection']['focusOffset'] = selection.focusOffset
                currentFile['selection']['anchorNode'] = selection.anchorNode
                currentFile['selection']['anchorOffset'] = selection.anchorOffset
                currentFile['selection']['type'] = selection.type
                currentFile['selection']['length'] = characters.length
                currentFile['selection']['content'] = selection.toString()
            }
        }
    },
    trackDynamically: true,
    trackMouse: true,
    trackPointer: true,
    trackKeyBoard: true,
    trackTouch: true,
    subscribeToDocument: true
})