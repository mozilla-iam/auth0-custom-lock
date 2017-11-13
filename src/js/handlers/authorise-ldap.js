module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  form.webAuth.authorize({
    responseType: 'code',
    redirectUri: 'http://localhost:8080/callback'
  });
}
