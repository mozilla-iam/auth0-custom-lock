var decorate = require( 'init/decorate' );
var setupHandlers = require( 'init/setupHandlers' );
var handlers = require( 'handlers' );
var decorators = require( 'decorators' );
var polyfill = require( 'polyfills/polyfill' );

window.Promise = require( 'promise-polyfill' );
require( 'whatwg-fetch' );
require( 'url-search-params-polyfill' );
polyfill();

document.documentElement.className = 'has-js';

// run all decorators on page load
decorate( decorators );

// bind click handler so that handlers run on click
// of elements with data-handler="handler"
setupHandlers( handlers );
