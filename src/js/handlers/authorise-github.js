var fireGAEvent = require( 'helpers/fireGAEvent' );
var storeLastUsedConnection = require( 'helpers/storeLastUsedConnection' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );
  var connection = 'github';

  fireGAEvent( 'Authorisation', 'Authorising with GitHub' );

  form.webAuth.authorize({
    responseType: 'token',
    connection: connection
  });

  storeLastUsedConnection( connection );
};
