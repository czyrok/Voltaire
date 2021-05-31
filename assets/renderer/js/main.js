function resetSettings() {
    newAlert(langConfig[defaultLanguage]['interface']['alert']['reset-settings'], 'blue')

    byID('reset-settings-button').setAttribute('id', 'reset-settings-button-spin')
    byID('reset-settings-button-spin').setAttribute('disabled', 'true')

    setTimeout(() => {
        byID('reset-settings-button-spin').setAttribute('id', 'reset-settings-button')
        byID('reset-settings-button').removeAttribute('disabled')
    }, 1000)

    ipcRenderer.send('reset-parameter-file')
}

function newAlert(text, color) {
    newAlertList.push({
        'text': text,
        'color': color
    })
}

function cancelAlert() {
    removeAlert()

    clearTimeout(alertTimeout)
    alertTimeout = undefined
}

function repairContentEditable(location, step) {
    let childNodesList = location.childNodes,
        elementCount = 0,

        divList = [],

        assembledTextList = [],
        beforeIsText = 0

    childNodesList.forEach((element) => {
        if (element.nodeName == '#text' && element.data != '' || element.nodeName == 'SPAN' && element.outerHTML != '<span></span>') {
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
        } else if (element.nodeName == 'DIV' && element.outerHTML != '<div></div>') {
            divList.push(element)

            elementCount++
            beforeIsText = 0
        } else if (
            element.nodeName == 'BR' && location.id == `file-${currentFileNum}`
            || element.nodeName == 'BR' && location.id == 'copie'
            || element.nodeName == 'DIV' && element.outerHTML == '<div></div>' && location.id == `file-${currentFileNum}`
            || element.nodeName == 'DIV' && element.outerHTML == '<div></div>' && location.id == 'copie'
        ) {
            location.removeChild(element)
        }
    })

    if (step == 1) {
        if (assembledTextList.length != 0) {
            if (
                divList.length != 0
                || location.id == `file-${currentFileNum}`
                || location.id == 'copie'
                /* || elementCount > 1
                || assembledTextList[0]['text'].split('\n').length > 1
                || divList.length == 0 && elementCount == 1 && location.id == `file-${currentFileNum}`
                || divList.length == 0 && elementCount == 1 && location.id == 'copie' */
            ) {
                assembledTextList.forEach((textElement) => {
                    textElement['remove'].forEach((element) => {
                        location.removeChild(element)
                    })

                    let createdDiv = document.createElement('div'),
                        separatedText = textElement['text'].split('\n')

                    separatedText.forEach((text) => {
                        let div = document.createElement('div')
                        div.innerHTML = text

                        createdDiv.appendChild(div)
                    })

                    location.appendChild(createdDiv)
                    location.replaceChild(createdDiv, textElement['first'])

                    /* let createdDiv = document.createElement('div')
                    createdDiv.textContent = text['text']
    
                    location.appendChild(createdDiv)
                    location.replaceChild(createdDiv, text['first']) */

                    textInContentEditable = 1
                })
            }
        }

        repairContentEditable(location, 2)
    } else {
        if (
            location.id == `file-${currentFileNum}`
            || location.id == 'copie'
        ) {
            divList.forEach((div) => {
                return repairContentEditable(div, 1)
            })
        } else if (divList.length == 1) {
            location.innerHTML = divList[0].innerHTML

            return repairContentEditable(location, 1)
        } else if (divList.length > 1) {
            let parentNode = location.parentNode
            let i

            for (i = 1; i <= divList.length; i++) {
                parentNode.insertBefore(divList[divList.length - i], location.nextSibling)
            }

            parentNode.removeChild(location)
            return repairContentEditable(parentNode, 1)
        }
    }
}

function updateElementsList() {
    let currentFile = file[currentFileNum.toString()],
        childNodesList = byID(`file-${currentFileNum}`).childNodes

    currentFile['global']['elements'] = []

    if (childNodesList.length != 0) {
        childNodesList.forEach((element) => {
            if (
                element.nodeName == 'DIV' && element.data != ''
                || element.nodeName == 'BR'
                || element.nodeName == '#text' && element.data != ''
            ) {
                currentFile['global']['elements'].push(element)
            }
        })
    }
}

function removeHLJS() {
    $(`#file-${currentFileNum}`).removeClass('hljs')

    HLJSElements = qSelectAll('*[class^=hljs]')

    HLJSElements.forEach((element) => {
        $(element.parentNode).find(element).contents().unwrap()
    })
}

ipcRenderer.on('show-menu', () => {
    showMenu()
})

ipcRenderer.on('show-settings', () => {
    showMenu(true)
})

ipcRenderer.on('update', (e, percent) => {
    if (updateDownloadIsActive == 0) {
        updateDownloadIsActive = 1

        byID('circle').style.strokeDashoffset = 50 - percent

        showRemoveUpdate()
    } else if (percent == 50) {
        byID('circle').style.strokeDashoffset = 0

        setTimeout(() => {
            if (updateIsShowed == 1) showRemoveUpdate()
        }, 1e3)
    } else {
        byID('circle').style.strokeDashoffset = 50 - percent
    }
})