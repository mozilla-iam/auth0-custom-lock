var fireGAEvent = require( 'helpers/fire-ga-event' );
var storeLastUsedConnection = require( 'helpers/store-last-used-connection' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );
  var connection = 'firefoxaccounts';
  var url = window.location;
  var params = new URLSearchParams( url.search );
  var newLocation;

  fireGAEvent( 'Authorisation', 'Authorising with Firefox Accounts' );

  if ( params.get( 'prompt' ) ) {
    params.delete( 'prompt' );
  }

  newLocation = url.origin + url.pathname + '?' + params.toString();

  window.history.pushState( null, null, newLocation );

  form.webAuth.authorize({
    responseType: 'token',
    connection: connection
  });

  storeLastUsedConnection( connection );
};
