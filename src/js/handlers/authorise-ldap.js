var ui = require( 'helpers/ui' );
var dom = require( 'helpers/dom' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var storeLastUsedConnection = require( 'helpers/store-last-used-connection' );

module.exports = function authorise( element, secondTry ) {
  var form = element.tagName === 'FORM' ? element : element.form;
  var emailField = dom.getEmailField();
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

    if ( error.error && error.error === 'request_error' ) {
      errorText.lastElementChild.textContent = 'An invalid request error occurred';
      fireGAEvent( 'Error', 'LDAP: request invalid' );
      ui.setLockState( element, 'error-password' );
    }

    if ( error.code && error.code === 'invalid_user_password' ) {
      errorText.lastElementChild.textContent = error.description;
      fireGAEvent( 'Error', 'LDAP: invalid username or password' );
      ui.setLockState( element, 'error-password' );
    }
  });
  storeLastUsedConnection( connection );
};
