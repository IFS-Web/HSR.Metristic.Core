/// <reference path="../typings/tsd.d.ts" />
"use strict";

let express = require('express');
let handlebars = require('express-hbs');

import {UploadController} from "./controllers/upload-controller";
import {CheckManager} from "./domain/model/check-manager";
import {StructureMetric} from "./domain/model/structure-metric";

import {HANDLEBARS_CONFIGURATION, ASSETS_DIRECTORY, APP_PORT} from "./configuration/app";


let app = express();
app.engine('html', handlebars.express4(HANDLEBARS_CONFIGURATION));

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use('/assets', express.static(ASSETS_DIRECTORY));


app.get('/', UploadController.indexAction);
app.post('/upload', UploadController.uploadAction);


app.listen(APP_PORT);
console.log('Server running on http://localhost:'+APP_PORT);