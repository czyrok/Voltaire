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