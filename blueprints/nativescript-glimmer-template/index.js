'use strict';
const chalk = require('chalk');
const stringUtil = require('ember-cli-string-utils');
const sortPackageJson = require('sort-package-json');
const path = require('path');
const fs = require('fs-extra');

const stringifyAndNormalize = function stringifyAndNormalize(contents) {
  return `${JSON.stringify(contents, null, 2)}\n`;
};

module.exports = {
  description: '',

  normalizeEntityName() {}, // no-op since we're just adding dependencies

  beforeInstall() {
    return this.addPackagesToProject([{name: 'nativescript-dev-webpack', target: '~0.20.0'}]);
  },

  _readJsonSync(path) {
    return fs.readJsonSync(path);
  },

  _writeFileSync(path, content) {
    fs.writeFileSync(path, content);
  },

  updatePackageJson(content) {

   content.nativescript = {
     "id": `org.nativescript.${stringUtil.camelize(this.options.entity.name)}`,
     "tns-ios": {
       "version": "5.2.0"
     },
     "tns-android": {
       "version": "5.2.1"
     }
   };

   return stringifyAndNormalize(sortPackageJson(content));
 },

  afterInstall: function() {
    let task = this.taskFor('npm-install');
    let packages = [
      { name: 'nativescript-theme-core', target: '~1.0.4'},
      { name: 'tns-core-modules', target: '5.2.2'},
      { name: 'nativescript-glimmer', target: 'git+https://github.com/bakerac4/nativescript-glimmer.git#test3'}
    ];
    let installText = (packages.length > 1) ? 'install packages' : 'install package';
    let packageNames = [];
    let packageArray = [];

    for (let i = 0; i < packages.length; i++) {
      packageNames.push(packages[i].name);

      let packageNameAndVersion = packages[i].name;

      if (packages[i].target) {
        packageNameAndVersion += `@${packages[i].target}`;
      }

      packageArray.push(packageNameAndVersion);
    }

    this._writeStatusToUI(chalk.green, installText, packageNames.join(', '));
    return task.run({
      'save-dev': false,
      verbose: false,
      packages: packageArray,
    }).then(() => {
      let packagePath = path.join(this.project.root, 'package.json');
      let contents = this._readJsonSync(packagePath);
      let updatedContents = this.updatePackageJson(contents);
      return this._writeFileSync(packagePath, updatedContents);
    })
  }
};
