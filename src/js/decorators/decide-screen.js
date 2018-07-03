var filterConnections = require( 'decorators/filter-connections' );
var ui = require( 'helpers/ui' );
var hasParams = require( 'helpers/has-params' );

module.exports = function decideScreen( element ) {

  if ( hasParams( 'action=autologin_settings' ) ) {
    ui.setLockState( element, 'autologin-settings' );
  }
  else if ( hasParams( 'action=error_githubrequiremfa' ) ) {
    ui.setLockState( element, 'error-githubrequiremfa' );
  }
  else if ( hasParams( 'action=error_fxarequiremfa' ) ) {
    ui.setLockState( element, 'error-fxarequiremfa' );
  }
  else if ( hasParams( 'action=error_notingroup' ) ) {
    ui.setLockState( element, 'error-notingroup' );
  }
  else if ( hasParams( 'action=error_accesshasexpired' ) ) {
    ui.setLockState( element, 'error-accesshasexpired' );
  }
  else if ( hasParams( 'action=error_primarynotverified' ) ) {
    ui.setLockState( element, 'error-primarynotverified' );
  }
  else if ( hasParams( 'action=error_incorrectaccount' ) ) {
    ui.setLockState( element, 'error-incorrectaccount' );
  }
  else if ( hasParams( 'action=error_general' ) ) {
    ui.setLockState( element, 'error-general' );
  }
  else {
    filterConnections( element );
  }
};
