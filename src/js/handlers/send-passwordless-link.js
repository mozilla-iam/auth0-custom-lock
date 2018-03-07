var fireGAEvent = require( 'helpers/fire-ga-event' );
var ui = require( 'helpers/ui' );
var storeLastUsedConnection = require( 'helpers/store-last-used-connection' );

module.exports = function authorise( element ) {
  var emailField = document.getElementById( 'field-email' );
  var form = element.form;
  var emailPlaceholder = document.getElementById( 'passwordless-success-email-address' );
  var errorText = document.getElementById( 'error-message-passwordless' );
  var connection = 'email';

  ui.setLockState( element, 'loading' );

  fireGAEvent( 'Authorisation', 'Requested passwordless link' );

  storeLastUsedConnection( connection );

  form.webAuth.passwordlessStart({
    connection: 'email',
    send: 'link',
    responseType: 'token',
    email: emailField.value
  }, function( error, response ) {
    if ( error ) {
      if ( error.code === 'bad.email' || error.code === 'invalid_parameter' ) {
        errorText.lastElementChild.textContent = error.description;
        ui.setLockState( element, 'error-passwordless' );
        fireGAEvent( 'Error', 'Passwordless: email address invalid' );
      }
      else {
        ui.setLockState( element, 'initial' );
      }
    }
    if ( response ) {
      emailPlaceholder.textContent = emailField.value;
      ui.setLockState( element, 'passwordless-success' );
    }
  });
};
