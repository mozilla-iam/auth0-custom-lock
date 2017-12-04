var ui = require( 'helpers/ui' );

module.exports = function authorise( element ) {
  var emailField = document.getElementById( 'field-email' );
  var form = element.form;
  var emailPlaceholder = document.getElementById( 'passwordless-success-email-address' );

  ui.setLockState( element, 'loading' );

  form.webAuth.passwordlessStart({
    connection: 'email',
    send: 'link',
    responseType: 'token',
    email: emailField.value
  }, function( error, response ) {
    if ( error ) {
      console.log( error );
      ui.setLockState( element, 'non-ldap' );
    }
    if ( response ) {
      emailPlaceholder.textContent = emailField.value;
      ui.setLockState( element, 'passwordless-success' );
    }
  });
}
