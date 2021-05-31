if (HTMLImportLinks.length <= 0) {
	console.log('[No HTML file loaded]')
} else {
	let currentDate = new Date()

	HTMLImportLinks.forEach((e) => {
		ejs.renderFile(`${__dirname}/${e.getAttribute('href')}`, function (error, data) {
			if (error) console.error(error)

			qSelect('body').innerHTML = qSelect('body').innerHTML + data

			HTMLImportedFilesCount++

			if (HTMLImportedFilesCount == HTMLImportLinks.length) {
				if (HTMLImportedFilesCount == 1) {
					console.log(`[${HTMLImportedFilesCount} HTML file loaded in ${new Date() - currentDate}ms]`)
				} else {
					console.log(`[${HTMLImportedFilesCount} HTML files loaded in ${new Date() - currentDate}ms]`)
				}

				HTMLImportHaveFinished = 1
			}
		})

		/* 		fs.readFile(`${__dirname}/${e.getAttribute('href')}`, (error, data) => {
					if (error) console.error(error)
		
					qSelect('body').innerHTML = qSelect('body').innerHTML + data
		
					HTMLImportedFilesCount++
		
					if (HTMLImportedFilesCount == HTMLImportLinks.length) {
						if (HTMLImportedFilesCount == 1) {
							console.log(`[${HTMLImportedFilesCount} HTML file loaded in ${new Date() - currentDate}ms]`)
						} else {
							console.log(`[${HTMLImportedFilesCount} HTML files loaded in ${new Date() - currentDate}ms]`)
						}
		
						HTMLImportHaveFinished = 1
					}
				})
		
				fetch(e.getAttribute('href'))
					.then((response) => {
						return response.text()
					})
					.then((data) => {
						qSelect('body').innerHTML = qSelect('body').innerHTML + data
		
						HTMLImportedFilesCount++
		
						if (HTMLImportedFilesCount == HTMLImportLinks.length) {
							if (HTMLImportedFilesCount == 1) {
								console.log(`[${HTMLImportedFilesCount} HTML file loaded in ${new Date() - currentDate}ms]`)
							} else {
								console.log(`[${HTMLImportedFilesCount} HTML files loaded in ${new Date() - currentDate}ms]`)
							}
		
							HTMLImportHaveFinished = 1
						}
					}) */
	})
}

if (CSSImportLinks.length <= 0) {
	console.log('[No CSS file loaded]')
} else {
	let currentDate = new Date()

	CSSImportLinks.forEach((e) => {
		const localsName = require('../../config/css-config.json')

		ejs.renderFile(`${__dirname}/${e.getAttribute('href')}`, localsName, function (error, data) {
			if (error) console.error(error)

			qSelect('body').innerHTML = qSelect('body').innerHTML + data

			CSSImportedFilesCount++

			if (CSSImportedFilesCount == CSSImportLinks.length) {
				if (CSSImportedFilesCount == 1) {
					console.log(`[${CSSImportedFilesCount} CSS file loaded in ${new Date() - currentDate}ms]`)
				} else {
					console.log(`[${CSSImportedFilesCount} CSS files loaded in ${new Date() - currentDate}ms]`)
				}
			}
		})
	})
}