var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  fireGAEvent( 'Authorisation', 'Authorising with Google' );

  form.webAuth.authorize({
    responseType: 'token',
    connection: 'google-oauth2'
  });
};
