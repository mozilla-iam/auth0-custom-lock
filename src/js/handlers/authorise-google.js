module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  form.webAuth.authorize({
    responseType: 'token',
    redirectUri: 'http://localhost:3000',
    connection: 'google-oauth2'
  });
}
