'use strict';

var Path = require('path');


module.exports = {
	ASSETS_DIRECTORY: Path.join(__dirname, '../assets'),
	HANDLEBARS_CONFIGURATION: {
		//partialsDir: Path.join(__dirname, '../views/partials'),
		defaultLayout: Path.join(__dirname, '../views/layouts/main'),
		extname: '.html',
		layoutsDir: Path.join(__dirname, '../views/layouts')
	}
};
