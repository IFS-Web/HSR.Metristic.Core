/* tslint:disable:no-console */

'use strict';

let express = require('express');
let handlebars = require('express-hbs');
let limits = require('limits');
let Path = require('path');

import {UploadController} from "./controllers/upload-controller";
import {formatDate} from "./views/helpers/moment-helper";
import {Profile} from "./domain/model/profile";
import {CheckConstructor} from "./domain/model/check";

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
		this.config['PLUGIN_STYLESHEET_PATHS'] = this.getPluginStyleSheetPaths();
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

		this.app.use('/assets/core', express.static(this.config['ASSETS_DIRECTORY']));
		// expose all asset directories of the plugins as /assets/plugins/pluginname/
		this.getPluginAssetsConfiguration().forEach((pluginAssetsConfig) => {
			this.app.use(`/assets/plugins/${pluginAssetsConfig.name}`, express.static(pluginAssetsConfig.path));
		});

		let uploadController = new UploadController(this.profiles, this.config);

		this.app.post('/upload', uploadController.uploadAction.bind(uploadController));
		this.app.get('/', uploadController.indexAction.bind(uploadController));
	}

	private getConfiguredPlugins(): CheckConstructor[] {
		let plugins = [];
		Object.keys(this.profiles).forEach((profileKey) => {
			plugins = plugins.concat(this.profiles[profileKey].checks);
		});
		// remove duplicates
		return plugins.filter((plugin, index, self) => {
			return self.indexOf(plugin) === index;
		});
	}

	private getPluginAssetsConfiguration():{ name: string, path: string }[] {
		return this.getConfiguredPlugins()
			.filter((plugin) => Boolean(plugin.assetsDirectory))
			.map((plugin) => {
				let pluginName = ((<any> plugin).name).toLowerCase();
				return { name: pluginName, path: plugin.assetsDirectory };
			});
	}

	private getPluginStyleSheetPaths():string[] {
		return this.getConfiguredPlugins()
			.reduce((styleSheets, plugin) => {
				let pluginName = ((<any> plugin).name).toLowerCase();
				let styleSheetPaths: string[] = (plugin.styleSheetFiles || [])
					.filter((styleSheetPath) => Boolean(styleSheetPath))
					.map((relativeStylesheetPath) =>
						Path.join(`./assets/plugins/${pluginName}/`, relativeStylesheetPath)
					);
				return styleSheets.concat(styleSheetPaths);
			}, []);
	}

	public start() {
		this.app.listen(this.config['APP_PORT']);
		console.log('Server running on http://localhost:' + this.config['APP_PORT']);
	}
}
