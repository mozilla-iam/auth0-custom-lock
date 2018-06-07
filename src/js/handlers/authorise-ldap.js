var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var storeLastUsedConnection = require( 'helpers/store-last-used-connection' );

module.exports = function authorise( element, secondTry ) {
  var form = element.tagName === 'FORM' ? element : element.form;
  var emailField = document.getElementById( 'field-email' );
  var passwordField = secondTry ? document.getElementById( 'field-password-try-2' ) : document.getElementById( 'field-password' );
  var errorText = document.getElementById( 'error-message-ldap' );
  var connection = NLX.LDAP_connection_name;

  if ( element.id === 'authorise-ldap-credentials-try-2' ) {
    passwordField = document.getElementById( 'field-password-try-2' );
  }

  ui.setLockState( element, 'loading' );

  fireGAEvent( 'Authorisation', 'Authorising with LDAP' );

  if ( form.loginMethods && form.loginMethods['supportedByRP'].indexOf( NLX.LDAP_connection_name ) === -1 ) {
    ui.setLockState( element, 'ldap-not-available' );
    return;
  }

  form.webAuth.login({
    realm: connection,
    username: emailField.value.toLowerCase(),
    password: passwordField.value
  }, function( error ) {
    errorText.lastElementChild.textContent = error.description;
    ui.setLockState( element, 'error-password' );
    fireGAEvent( 'Error', 'LDAP: invalid username or password' );
  });
  storeLastUsedConnection( connection );
};
