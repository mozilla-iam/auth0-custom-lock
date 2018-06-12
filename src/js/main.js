var decorate = require( 'init/decorate' );
var setupHandlers = require( 'init/setupHandlers' );
var handlers = require( 'handlers' );
var decorators = require( 'decorators' );
var polyfill = require( 'polyfills/polyfill' );
var settingsElement = document.getElementById( 'nlx-config' );

window.Promise = require( 'promise-polyfill' );
require( 'whatwg-fetch' );
require( 'url-search-params-polyfill' );
polyfill();

document.documentElement.className = 'has-js';

window.NLX = JSON.parse( settingsElement.textContent );
console.log ( '--- start NLX config as fetched  --');
console.log ( NLX );
console.log ( '--- end NLX config as fetched --');

// run all decorators on page load
decorate( decorators );

// bind click handler so that handlers run on click
// of elements with data-handler="handler"
setupHandlers( handlers );
