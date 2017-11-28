module.exports = function authorise( element ) {
  var form = element.closest( 'form' );
  var emailField = document.getElementById( 'field-email' );
  var passwordField = document.getElementById( 'field-password' );
  var button = document.getElementById( 'authorise-ldap-credentials' );

  form.webAuth.redirect.loginWithCredentials({
    connection: 'Username-Password-Authentication',
    username: emailField.value,
    password: passwordField.value,
    redirectUri: 'http://localhost:3000',
    scope: 'openid'
  }, function(err, authResult) {
    button.classList.add( 'button--loading' );
  });
}
