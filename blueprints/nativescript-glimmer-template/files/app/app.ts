import NativescriptGlimmer from 'nativescript-glimmer';
import { ResolverDelegate, Resolver, NativeComponent } from 'nativescript-glimmer';
import Component from '@glimmer/component';
import {knownFolders} from "tns-core-modules/file-system";
const resolverDelegate = new ResolverDelegate();
const resolver = new Resolver();

function addTemplates(appFolder) {

    let templatesFile = appFolder.getFile("templates.json");
    let templates = templatesFile.readTextSync();
    // console.log(`Templates: ${templates}`);
    JSON.parse(templates).forEach(template => {
        resolverDelegate.addComponent(template.name, template.handle, template.source, template.capabilities);
    });
}

function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../src/ui/components/', true, /component.ts$/));

try {
    let appFolder = knownFolders.currentApp();
    addTemplates(appFolder);

    let componentsFile = appFolder.getFile("components.json");
    let components = componentsFile.readTextSync();
    console.log(`About to resolve require`);
    JSON.parse(components).forEach(component => {
        console.log(`About to resolve require`);
        const classFile = require(`../src/ui/components/${component.name}/component.ts`);
        resolver.addComponent(component.name, classFile.default);
    });

    const app = new NativescriptGlimmer('MainTemplate', {}, resolverDelegate, resolver);

    app.render();

} catch(errors) {

}
