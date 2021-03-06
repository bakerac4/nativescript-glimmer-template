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

    locals(options) {
        let packageName = options.project.pkg.name;
        const name = stringUtil.classify(packageName);

        return {
            name
        };
    },

    normalizeEntityName() {}, // no-op since we're just adding dependencies

    _readJsonSync(path) {
        return fs.readJsonSync(path);
    },

    _writeFileSync(path, content) {
        fs.writeFileSync(path, content);
    },

    updatePackageJson(content, options) {
        const name = options.project.pkg.name;

        content.nativescript = {
            "id": `org.nativescript.${stringUtil.camelize(name)}`,
            "tns-ios": {
                "version": "5.2.0"
            },
            "tns-android": {
                "version": "5.2.1"
            }
        };

        return stringifyAndNormalize(sortPackageJson(content));
    },

    getDefaultComponentHbs() {
        return `
        <page>
            <actionbar>
                <label text="Welcome to nativescript glimmer"  class="action-label"></label>
                </actionbar>
        </page>
        `;
    },

    afterInstall: function(options) {
        let task = this.taskFor('npm-install');
        let packages = [
            { name: 'nativescript-theme-core', target: '~1.0.4'},
            { name: 'tns-core-modules', target: '5.2.2'},
            { name: 'nativescript-glimmer', target: 'git+https://github.com/bakerac4/nativescript-glimmer.git#master'},
            { name: 'glimmer-analyzer', target: '^0.3.3'},
            { name: '@glimmer/compiler', target: '^0.39.2'}
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
            let updatedContents = this.updatePackageJson(contents, options);
            return this._writeFileSync(packagePath, updatedContents);
        }).then(() => {
            let packagePath = path.join(this.project.root, 'app/app.css');
            return fs.ensureFileSync(packagePath);
        }).then(() => {
            let componentPath = path.join(this.project.root, `src/ui/components/${stringUtil.classify(options.project.pkg.name)}/template.hbs`);
            let updatedComponent = this.getDefaultComponentHbs();
            return this._writeFileSync(componentPath, updatedComponent);
        })
    }
};
