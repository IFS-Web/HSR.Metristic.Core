'use strict';

var Path = require('path');


module.exports = {
	ASSETS_DIRECTORY: Path.join(__dirname, '../app/assets'),
	HANDLEBARS_CONFIGURATION: {
		//partialsDir: Path.join(__dirname, '../app/views/partials'),
		defaultLayout: Path.join(__dirname, '../app/views/layouts/main'),
		extname: '.html',
		layoutsDir: Path.join(__dirname, '../app/views/layouts')
	}
};
