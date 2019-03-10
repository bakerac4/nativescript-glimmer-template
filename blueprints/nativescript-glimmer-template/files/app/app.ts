import NativescriptGlimmer from 'nativescript-glimmer';
import { ResolverDelegate, Resolver, NativeComponent } from 'nativescript-glimmer';
import Component from '@glimmer/component';

const resolverDelegate = new ResolverDelegate();
resolverDelegate.addComponent(
  'GlimmerMobile',
  0,
  `
  <page>

	<actionBar class="action-bar">
		<label class="action-bar-title" text="Home"></label>
	</actionBar>

	<gridlayout>
		<scrollview class="page">
			<stacklayout class="home-panel">
				<!--Add your page content here-->
				<label textWrap="true" text="Payments App!" class="h2 description-label opensans-semi-bold"></label>
				<label textWrap="true" text="This sample App is to showcase how to implement a carousel with purely XML, JS and CSS only."
				 class="h3 description-label opensans-regular"></label>
				<label textWrap="true" text="This sample used the 'ui/builder' plugin to dynamically loading custom components from XML templates."
				 class="h3 description-label opensans-regular"></label>
			</stacklayout>
		</scrollview>
	</gridlayout>
</page>
  `
  ,
  {
    attributeHook: true,
    createArgs: true,
    createCaller: false,
    createInstance: true,
    dynamicLayout: false,
    dynamicScope: false,
    dynamicTag: true,
    elementHook: true,
    prepareArgs: false,
    updateHook: true,
    wrapped: false,
  }
);

class GlimmerMobile extends Component {
  title = 'Hi';
}

const resolver = new Resolver();
resolver.addComponent('GlimmerMobile', GlimmerMobile);
const template = `<GlimmerMobile />`;
const app = new NativescriptGlimmer(template, {}, resolverDelegate, resolver);

app.render();
