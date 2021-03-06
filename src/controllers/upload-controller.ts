'use strict';

let fs = require('fs');
let formidable = require('formidable');
let DecompressZip = require('decompress-zip');
let uuid = require('node-uuid');
let rmdir = require('rmdir');

import {CheckManager} from "../domain/model/check-manager";
import {Report} from "../domain/report/report";
import {Profile} from "../domain/model/profile";


interface User { name: string, email: string }


export class UploadController {
	constructor(private profiles: {[name:string]: Profile}, private config: {[name: string]: any}) {

	}
	public indexAction(request, response): void {
		response.render('home', { profiles: this.profiles, maxUpload: this.config['MAX_UPLOAD_SIZE'] });
	}

	public uploadAction(request, response, next): void {
		let form = new formidable.IncomingForm();

		let targetDirectory: string = this.config['ARCHIVE_TMP_DIRECTORY'] + uuid.v1();
		let manager: CheckManager = new CheckManager(targetDirectory);

		form.parse(request, (error, fields, files) => {
			if (files[ 'archive' ] && fields['user'] && fields['email'] && fields['profile']) {
				let profile = this.profiles[fields['profile']];
				let user: User = {
					name: fields['user'],
					email: fields['email']
				};

				let file = files['archive'];

				let unzipper = new DecompressZip(file['path']);
				unzipper.on('extract', () => {
					this.execute(manager, profile, user, response, file, targetDirectory);
				});
				unzipper.on('error', function (err) {
					response.status(400).send(`Only zip is allowed: ${err}`);
				});
				unzipper.extract({path: targetDirectory});
			}
		});
	}

	private execute(manager: CheckManager, profile: Profile, user: User, response, file: string, targetDirectory: string) {
		manager.execute(profile, (reports: Report[]) => {
			response.render('upload', {
				pluginStyleSheets: this.config['PLUGIN_STYLESHEET_PATHS'],
				date: Date.now(),
				user: user,
				name: file[ 'name' ],
				size: file[ 'size' ] / 1000, // KiB
				profile: profile,
				reports: reports.map((report) => { return { name: report.name, report: report.renderReport() }; })
			});
			rmdir(targetDirectory);
		});
	};
}
