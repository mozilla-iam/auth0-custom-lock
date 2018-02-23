var decorate = require( 'init/decorate' );
var setupHandlers = require( 'init/setupHandlers' );
var handlers = require( 'handlers' );
var decorators = require( 'decorators' );
var polyfill = require( 'polyfills/polyfill' );

window.Promise = require( 'promise-polyfill' );
require( 'whatwg-fetch' );

document.documentElement.className = 'has-js';

// environment variables are replaced in build process
window.NLX = {
  'auth0_domain': '{{{ auth0_domain }}}',
  'client_ID': '{{{ client_ID }}}',
  'LDAP_connection_name': '{{{ LDAP_connection_name }}}',
  'person_api_domain': '{{{ person_api_domain }}}',
  'GTM_ID': '{{{ GTM_ID }}}'
};

polyfill();

// run all decorators on page load
decorate( decorators );

// bind click handler so that handlers run on click
// of elements with data-handler="handler"
setupHandlers( handlers );
