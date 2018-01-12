var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function authorise( element ) {
  var form = element.tagName === 'FORM' ? element : element.form;;
  var emailField = document.getElementById( 'field-email' );
  var passwordField = document.getElementById( 'field-password' );
  var errorText = document.getElementById( 'error-message-ldap' );

  if ( element.id === 'authorise-ldap-credentials-try-2' ) {
    passwordField = document.getElementById( 'field-password-try-2' );
  }

  ui.setLockState( element, 'loading' );

  fireGAEvent( 'Authorisation', 'Authorising with LDAP' );

  form.webAuth.redirect.loginWithCredentials({
    connection: 'Mozilla-LDAP-Dev',
    username: emailField.value,
    password: passwordField.value,
    scope: 'openid'
  }, function( error ) {

    if ( error && error.code === 'invalid_user_password' ) {
      errorText.lastElementChild.textContent = error.description;
      ui.setLockState( element, 'error-password' );
      fireGAEvent( 'Error', 'LDAP: invalid username or password' );
    }
  });
};
