var ui = require( 'helpers/ui' );

module.exports = function goToInitialPage( element ) {
  ui.setLockState( element, 'initial' );
}
