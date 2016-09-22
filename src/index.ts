/* tslint:disable:no-console */

/// <reference path="../typings/tsd.d.ts" />
"use strict";

let express = require('express');
let handlebars = require('express-hbs');
let limits = require('limits');

import {UploadController} from "./controllers/upload-controller";
import {formatDate} from "./views/helpers/moment-helper";

let AppConfig: any = require("./configuration/app");

let limitsConfig = {
	enable: true,
	file_uploads: true,
	post_max_size: AppConfig.MAX_UPLOAD_SIZE * 1024 * 1024
};

handlebars.registerHelper('moment', formatDate);

let app = express();
app.engine('html', handlebars.express4(AppConfig.HANDLEBARS_CONFIGURATION));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(limits(limitsConfig));

app.use('/assets', express.static(AppConfig.ASSETS_DIRECTORY));

app.post('/upload', UploadController.uploadAction);
app.get('/', UploadController.indexAction);


app.listen(AppConfig.APP_PORT);
console.log('Server running on http://localhost:'+AppConfig.APP_PORT);