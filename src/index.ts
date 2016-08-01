/// <reference path="../typings/tsd.d.ts" />

let express = require('express');
let handlebars = require('express-hbs');
let path = require('path');


const HANDLEBARS_CONFIGURATION = {
	partialsDir   : __dirname +'/views/partials',
	defaultLayout : __dirname +'/views/layouts/main',
	extname       : '.html',
	layoutsDir    : __dirname +'/views/layouts',
};
const APP_PORT = process.env.APP_PORT || 8080;
const ASSETS_DIRECTORY = __dirname + '/assets';


let app = express();
app.engine('html', handlebars.express4(HANDLEBARS_CONFIGURATION));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/assets', express.static(ASSETS_DIRECTORY));

app.get('/', (request, response) => {
	response.render('home', {});
});


app.listen(APP_PORT);
console.log('Server running on http://localhost:'+APP_PORT);