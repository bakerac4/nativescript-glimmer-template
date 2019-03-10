'use strict';

module.exports = {
  description: '',

  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

  afterInstall: function() {
    return this.addPackagesToProject([
      { name: 'nativescript-theme-core', target: '~1.0.4' },
      { name: 'tns-core-modules', target: '5.2.2' },
      { name: 'nativescript-glimmer', target: 'git+https://github.com/bakerac4/nativescript-glimmer.git#test3' }
    ]); // is a promise
  }
};
