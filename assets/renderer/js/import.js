let currentDate = new Date(),
	importLinks = document.querySelectorAll('link[rel="import"]'),
	importedFilesCount = 0

if (importLinks.length <= 0) {
	console.log('[No HTML file loaded]')
} else {
	Array.prototype.forEach.call(importLinks, (e) => {
		fetch(e.getAttribute('href'))
			.then((response) => {
				return response.text()
			})
			.then((element) => {
				qSelect('body').innerHTML = qSelect('body').innerHTML + element

				importedFilesCount++

				if (importedFilesCount == importLinks.length) {
					if (importedFilesCount == 1) {
						console.log(`[${importedFilesCount} HTML file loaded in ${new Date() - currentDate}ms]`)
					} else {
						console.log(`[${importedFilesCount} HTML files loaded in ${new Date() - currentDate}ms]`)
					}

					importHaveFinished = 1
				}
			})
	})
}