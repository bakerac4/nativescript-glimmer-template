'use strict';
const chalk = require('chalk');

module.exports = {
  description: '',

  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

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
    return this.addPackagesToProject([{name: 'nativescript-dev-webpack', target: '~0.20.0'}]).then(() => {
      return task.run({
        'save-dev': false,
        verbose: false,
        packages: packageArray,
      });
    });
  }
};
