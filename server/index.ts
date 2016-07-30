/// <reference path="../typings/tsd.d.ts" />

import express = require('express');


let app = express();

app.get('/', (req, res) => {
	res.send('Hello TypeScript');
});


var appPort = process.env.APP_PORT || 8080;
app.listen(appPort);
console.log('Server running on http://localhost:'+appPort);