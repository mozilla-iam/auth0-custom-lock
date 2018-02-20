var fireGAEvent = require( 'helpers/fireGAEvent' );
var storeLastUsedConnection = require( 'helpers/storeLastUsedConnection' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );
  var connection = 'google-oauth2';

  fireGAEvent( 'Authorisation', 'Authorising with Google' );

  form.webAuth.authorize({
    responseType: 'token',
    connection: connection
  });

  storeLastUsedConnection( connection );
};
