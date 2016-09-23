let fs = require('fs');
let formidable = require('formidable');
let unzip = require('unzip');
let uuid = require('node-uuid');
let rmdir = require('rmdir');

import {CheckManager} from "../domain/model/check-manager";
import {Report} from "../domain/model/report";
import {Profile} from "../domain/model/Profile";

let AppConfig = require("../configuration/app");
let profiles: { [name: string]: Profile } = require("../configuration/profiles");

interface User { name: string, email: string }


export class UploadController {
	public static indexAction(request, response): void {
		response.render('home', { profiles: profiles, maxUpload: AppConfig.MAX_UPLOAD_SIZE });
	}

	public static uploadAction(request, response, next): void {
		let form = new formidable.IncomingForm();

		let targetDirectory: string = AppConfig.ARCHIVE_TMP_DIRECTORY + uuid.v1();
		let manager: CheckManager = new CheckManager(targetDirectory);
		let unziper = unzip.Extract({ path: targetDirectory });

		form.parse(request, (error, fields, files) => {
			if (files[ 'archive' ] && fields['user'] && fields['email'] && fields['profile']) {
				let profile = profiles[fields['profile']];
				let user: User = {
					name: fields['user'],
					email: fields['email']
				};

				let file = files[ 'archive' ];
				if (file[ 'type' ] == 'application/zip') {
					fs.createReadStream(file[ 'path' ]).pipe(unziper);
					unziper.on('close', () => {
						UploadController.execute(manager, profile, user, response, file, targetDirectory);
					});
				} else {
					response.status(400).send(`${file[ 'type' ]} is not an allowed file format. Only zip is allowed!`);
				}
			} else {
				//TODO: handle this error: new Error('Missing params'))
			}
		});
	}

	private static execute(manager: CheckManager, profile: Profile, user: User, response, file: string, targetDirectory: string) {
		manager.execute(profile, (reports: Report[]) => {
			response.render('upload', {
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
