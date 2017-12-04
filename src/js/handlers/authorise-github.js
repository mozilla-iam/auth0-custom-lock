module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  form.webAuth.authorize({
    responseType: 'token',
    callbackURL: form.webAuthConfig.callbackURL,
    connection: 'github'
  });
}
