/// <reference path="../typings/tsd.d.ts" />

let express = require('express');
let handlebars = require('express-hbs');
let path = require('path');
let fs = require('fs');
let formidable = require('formidable');
let unzip = require('unzip');
let uuid = require('node-uuid');


const HANDLEBARS_CONFIGURATION = {
	partialsDir   : __dirname +'/views/partials',
	defaultLayout : __dirname +'/views/layouts/main',
	extname       : '.html',
	layoutsDir    : __dirname +'/views/layouts',
};
const APP_PORT = process.env.APP_PORT || 8080;
const ASSETS_DIRECTORY = __dirname + '/assets';
const ARCHIVE_TMP_DIRECTORY = '/tmp/metristic/';


let app = express();
app.engine('html', handlebars.express4(HANDLEBARS_CONFIGURATION));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/assets', express.static(ASSETS_DIRECTORY));


app.get('/', (request, response) => {
	response.render('home', {});
});

app.post('/upload', (request, response) => {
	var form = new formidable.IncomingForm();
	form.parse(request, (error, fields, files) => {
		let file = files['archive'];
		if(file['type'] == 'application/zip') {
			let targetDirectory = ARCHIVE_TMP_DIRECTORY+uuid.v1();
			let unziper = unzip.Extract({ path: targetDirectory });
			fs.createReadStream(file['path']).pipe(unziper);
			unziper.on('close', () => {
				// (new CheckManager(targetDirectory)).execute();
				/*fs.readdir(targetDirectory, (error, fileList) => {
					console.log(fileList);
				});*/
			});
			response.render('upload', { name: file['name'], size: file['size']/1000+'kb' });
		} else {
			response.status(400).send(`${file['type']} is not an allowed file format. Only zip is allowed!`);
		}
	});
});


app.listen(APP_PORT);
console.log('Server running on http://localhost:'+APP_PORT);