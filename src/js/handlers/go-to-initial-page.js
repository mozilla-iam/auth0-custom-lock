var ui = require( 'helpers/ui' );
var fireGTMEvent = require( 'helpers/fireGTMEvent' );

module.exports = function goToInitialPage( element ) {
  ui.setLockState( element, 'initial' );
  fireGTMEvent( 'Screen change', 'Back to initial screen' );
};
