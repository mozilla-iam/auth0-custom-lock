var decorate = require( 'init/decorate' );
var setupHandlers = require( 'init/setupHandlers' );
var handlers = require( 'handlers' );
var decorators = require( 'decorators' );

document.documentElement.className = 'has-js';

window.setTimeout( function() {
  document.documentElement.className = 'card-delay';
}, 100 );

// run all decorators on page load
decorate( decorators );

// bind click handler so that handlers run on click
// of elements with data-handler="handler"
setupHandlers( handlers );
