var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fire-ga-event' );

module.exports = function goToInitialPage( element ) {
  ui.setLockState( element, 'initial' );
  fireGAEvent( 'Screen change', 'Back to initial screen' );
};
