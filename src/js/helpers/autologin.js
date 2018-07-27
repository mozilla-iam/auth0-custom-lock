var fireGAEvent = require( 'helpers/fire-ga-event' );

module.exports = function autologin( loginMethod, form ) {
  var visualStatusReport = document.getElementById( 'loading__status' );
  var url = window.location;
  var params = new URLSearchParams( url.search );
  var loginMethodDisplayName = NLX.displayNames[loginMethod] ? NLX.displayNames[loginMethod] : loginMethod;
  var newLocation;

  form.willRedirect = true;
  visualStatusReport.textContent = 'Attempting auto-login with ' + loginMethodDisplayName;

  params.set( 'sso', 'true' );
  params.set( 'connection', loginMethod );
  params.set( 'tried_autologin', 'true' );
  params.set( 'client_id', params.get( 'client' ) );
  params.delete( 'client' );

  // Remove 'prompt=&blah=...' where prompt is empty as this confuses OPs that do not support the OPTIONAL `prompt`
  // parameter, such as FxA
  if ( params.get( 'prompt' ) === '' ) {
    params.delete( 'prompt' );
  }

  newLocation = url.origin + url.pathname.replace( '/login', '/authorize' ) + '?' + params.toString();

  if ( window.history ) {
    window.history.pushState( null, null, newLocation );
  }
  window.location.replace( newLocation );

  fireGAEvent( 'Authorisation', 'Performing auto-login with ' + loginMethod );

  return;
};
