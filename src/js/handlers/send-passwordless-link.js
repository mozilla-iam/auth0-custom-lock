var fireGTMEvent = require( 'helpers/fireGTMEvent' );
var ui = require( 'helpers/ui' );

module.exports = function authorise( element ) {
  var emailField = document.getElementById( 'field-email' );
  var form = element.form;
  var emailPlaceholder = document.getElementById( 'passwordless-success-email-address' );
  var errorText = document.getElementById( 'error-message-passwordless' );

  ui.setLockState( element, 'loading' );

  fireGTMEvent( 'Requested passwordless link' );

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
}
