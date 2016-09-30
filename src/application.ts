/* tslint:disable:no-console */

'use strict';

let express = require('express');
let handlebars = require('express-hbs');
let limits = require('limits');

import {UploadController} from "./controllers/upload-controller";
import {formatDate} from "./views/helpers/moment-helper";
import {Profile} from "./domain/model/profile";

let appConfig: any = require("./../configuration/app");


export class Application {
	private app;
	private limitsConfig;
	config: {[name: string]: any};

	constructor(private profiles: {[name: string]: Profile}, config: {[name: string]: any}) {
		this.config = appConfig;
		// user config will overwrite config from configuration/app
		Object.keys(config).forEach((key) => {
			this.config[key] = config[key];
		});
		this.limitsConfig = {
			enable: true,
			file_uploads: true,
			post_max_size: this.config['MAX_UPLOAD_SIZE'] * 1024 * 1024
		};

		handlebars.registerHelper('moment', formatDate);

		this.app = express();
		this.app.engine('html', handlebars.express4(this.config['HANDLEBARS_CONFIGURATION']));

		this.app.set('view engine', 'html');
		this.app.set('views', __dirname + '/views');
		this.app.use(limits(this.limitsConfig));

		this.app.use('/assets', express.static(this.config['ASSETS_DIRECTORY']));

		let uploadController = new UploadController(this.profiles, this.config);

		this.app.post('/upload', uploadController.uploadAction.bind(uploadController));
		this.app.get('/', uploadController.indexAction.bind(uploadController));
	}

	public start() {
		this.app.listen(this.config['APP_PORT']);
		console.log('Server running on http://localhost:' + this.config['APP_PORT']);
	}
}
