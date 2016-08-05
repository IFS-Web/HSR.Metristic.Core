let Path = require('path');


export const APP_PORT = process.env.APP_PORT || 8080;
export const HANDLEBARS_CONFIGURATION = {
	partialsDir:   Path.join(__dirname,'../views/partials'),
	defaultLayout: Path.join(__dirname, '../views/layouts/main'),
	extname:       '.html',
	layoutsDir:    Path.join(__dirname,'../views/layouts')
};
export const ASSETS_DIRECTORY = Path.join(__dirname, '../assets');
export const ARCHIVE_TMP_DIRECTORY = '/tmp/metristic/';