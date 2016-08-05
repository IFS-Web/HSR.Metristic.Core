let path = require('path');
let fs = require('fs');
let formidable = require('formidable');
let unzip = require('unzip');
let uuid = require('node-uuid');
let rmdir = require('rmdir');

import {CheckManager} from "../domain/model/check-manager";
import {StructureMetric} from "../domain/model/structure-metric";
import {Check} from "../domain/model/check";
import {Report} from "../domain/model/report";

import {ARCHIVE_TMP_DIRECTORY} from "../configuration/app";


export class UploadController {
	public static indexAction(request, response): void {
		response.render('home', {});
	}

	public static uploadAction(request, response): void {
		let checks: Check[] = [ new StructureMetric() ];
		let form = new formidable.IncomingForm();

		let targetDirectory: string = ARCHIVE_TMP_DIRECTORY + uuid.v1();
		let manager: CheckManager = new CheckManager(targetDirectory);
		let unziper = unzip.Extract({ path: targetDirectory });

		form.parse(request, (error, fields, files) => {
			let file = files[ 'archive' ];
			if (file[ 'type' ] == 'application/zip') {
				fs.createReadStream(file[ 'path' ]).pipe(unziper);
				unziper.on('close', () => {
					UploadController.execute(manager, checks, response, file, targetDirectory);
				});
			} else {
				response.status(400).send(`${file[ 'type' ]} is not an allowed file format. Only zip is allowed!`);
			}
		});
	}

	private static execute(manager, checks, response, file, targetDirectory) {
		manager.execute(checks, (reports:Report[]) => {
			response.render('upload', {
				name: file[ 'name' ],
				size: file[ 'size' ] / 1000 + 'kb',
				reports: reports.map((report) => { return { name: report.name, report: report.renderReport() }})
			});
			rmdir(targetDirectory);
		});
	};
}