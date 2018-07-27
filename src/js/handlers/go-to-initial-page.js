var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var hasParams = require( 'helpers/has-params' );

module.exports = function goToInitialPage( element ) {
  if ( hasParams( 'action=signup' ) ) {
    ui.setLockState( element, 'initial-login-signup' );
  }
  else {
    ui.setLockState( element, 'initial' );
  }
  fireGAEvent( 'Screen change', 'Back to initial screen' );
};
