var fireGTMEvent = require( 'helpers/fireGTMEvent' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  fireGTMEvent( 'Authorised with Google' );

  form.webAuth.authorize({
    responseType: 'token',
    connection: 'google-oauth2'
  });
};
