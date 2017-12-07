module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  form.webAuth.authorize({
    responseType: 'token',
    redirectUri: form.webAuthConfig.callbackURL,
    callbackURL: form.webAuthConfig.callbackURL,
    connection: 'github'
  });
}
