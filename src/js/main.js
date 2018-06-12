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

/* Trigger NLX actions that should happen before user sees NLX */
if ( window.location.href.indexOf( 'action=logout' ) >= 0  ) {
  // clear autologin method
  if ( window.localStorage ) {
    window.localStorage.removeItem( 'nlx-last-used-connection' );
  }
  // redirect to logout URL
  window.location.replace( NLX.logout_url );
}

// run all decorators on page load
decorate( decorators );

// bind click handler so that handlers run on click
// of elements with data-handler="handler"
setupHandlers( handlers );
