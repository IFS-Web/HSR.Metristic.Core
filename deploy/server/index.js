/// <reference path="../typings/tsd.d.ts" />
"use strict";
var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hello TypeScript');
});
var appPort = process.env.APP_PORT || 8080;
app.listen(appPort);
console.log('Server running on http://localhost:' + appPort);
