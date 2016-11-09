Metristic core
==============

Metristic web application and plugin interfaces.


## Lisence
![Apache License Version 2.0](https://www.apache.org/img/asf_logo.png)
[Apache License Version 2.0](./LICENSE)


## Releases / Production

⬇ Download on the [Release page](https://github.com/wasabideveloper/HSR.Metristic.Core/releases)


## Installation

* Install [node.js](https://nodejs.org/en/)
* Extract archive
* Enter the extracted directory, e.g. `cd Metristic-core-1.0`.
* Run `npm install --production` to install the dependencies.


## Usage

Create a deployment/startup project and start the application there:
```typescript
import {Application} from "metristic-core";
import {Profile} from "metristic-core";

let profiles: { [name: string]: Profile } = require("../configuration/profiles");
let appConfig: { [name: string]: any } = require("../configuration/app");


let app = new Application(profiles, appConfig);
app.start();
```


## Development / build the project from source

See [HSR.Metristic documentation: development](https://github.com/wasabideveloper/HSR.Metristic#development)


### Commands

Deploy app to directory `app`:
```shell
npm run gulp deploy
```

Compile TS and run tests:
```shell
npm run gulp test
# or
npm test
```
