var Path = require('path');


module.exports = {
	APP_PORT: process.env.APP_PORT || 8080,
	HANDLEBARS_CONFIGURATION: {
		//partialsDir: Path.join(__dirname, '../views/partials'),
		defaultLayout: Path.join(__dirname, '../views/layouts/main'),
		extname: '.html',
		layoutsDir: Path.join(__dirname, '../views/layouts')
	},
	ASSETS_DIRECTORY: Path.join(__dirname, '../assets'),
	ARCHIVE_TMP_DIRECTORY: '/tmp/metristic/'
};