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


## How to build the project from source

### Global dependencies

* Node.js / npm
* Typescript Compiler ```npm install tsc --global```
* Typings ```npm install typings --global```

### Installation

* Install global dependencies
* Clone project
* Run `npm install` to install the dependencies.
* Install typings depencency `tsd install`

### Commands

Deploy app to directory `app`:
```shell
gulp deploy
```

Compile TS and run tests:
```shell
gulp test
# or
npm test
```

### Install new type declarations:
```shell
# jasmine example
tsd query jasmine --action install --save
```