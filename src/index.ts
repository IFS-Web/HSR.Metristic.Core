/// <reference path="../typings/tsd.d.ts" />
"use strict";

let express = require('express');
let handlebars = require('express-hbs');

import {UploadController} from "./controllers/upload-controller";
import {formatDate} from "./views/helpers/moment-helper";

let AppConfig: any = require("./configuration/app");

handlebars.registerHelper('moment', formatDate);

let app = express();
app.engine('html', handlebars.express4(AppConfig.HANDLEBARS_CONFIGURATION));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/assets', express.static(AppConfig.ASSETS_DIRECTORY));


app.get('/', UploadController.indexAction);
app.post('/upload', UploadController.uploadAction);


app.listen(AppConfig.APP_PORT);
console.log('Server running on http://localhost:'+AppConfig.APP_PORT);