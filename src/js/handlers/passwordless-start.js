var ui = require( 'helpers/ui' );

module.exports = function authorise( element ) {
  var emailField = document.getElementById( 'field-email' );
  var form = element.form;

  form.webAuth.passwordlessStart({
    connection: 'email',
    send: 'code',
    email: emailField.value
  }, function( err, res ) {
    ui.setLockState( element, 'passwordless-step-2' );
  });
}
