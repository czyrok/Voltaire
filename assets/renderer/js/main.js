ipcRenderer.on('show-menu', () => {
	if (menuIsShowed == 0) showRemoveMenu()
})

ipcRenderer.on('remove-menu', () => {
	if (menuIsShowed == 1) showRemoveMenu()
})

ipcRenderer.on('show-settings', () => {
	showSettings()
})

function resetSettings() {
	byID('reset-settings-button').setAttribute('id', 'reset-settings-button-spin')
	byID('reset-settings-button-spin').setAttribute('disabled', 'true')

	setTimeout(() => {
		byID('reset-settings-button-spin').setAttribute('id', 'reset-settings-button')
		byID('reset-settings-button').removeAttribute('disabled')
	}, 1000)

	ipcRenderer.send('reset-parameter-file')
}

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