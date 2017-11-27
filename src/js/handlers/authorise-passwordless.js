var ui = require( 'helpers/ui' );

module.exports = function authorise( element ) {
  var emailField = document.getElementById( 'field-email' );
  var codeField = document.getElementById( 'field-passwordless-code' );
  var form = element.form;

  form.webAuth.passwordlessVerify({
    connection: 'email',
    email: emailField.value,
    verificationCode: codeField.value
  });
}
