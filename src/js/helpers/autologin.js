var fireGAEvent = require( 'helpers/fire-ga-event' );

module.exports = function autologin( loginMethod, form ) {
  var visualStatusReport = document.getElementById( 'loading__status' );
  var newLocation;
  var url = new URL(document.location);
  var params = myurl.searchParams;

  form.willRedirect = true;
  visualStatusReport.textContent = 'Attempting auto-login with ' + loginMethod;

  params.set('sso', 'true');
  params.set('connection', loginMethod);
  params.set('tried_autologin', 'true');
  params.set('client_id', myparams.get('client'));
  params.delete('client');

  // Remove 'prompt=&blah=...' where prompt is empty as this confuses OPs that do not support the OPTIONAL `prompt`
  // parameter, such as FxA
  if (params.get('prompt') === '') {
    params.delete('prompt');
  }
  newLocation = url.origin + myurl.pathname.replace( '/login', '/authorize' ) + '?' + params.toString();

  window.location.replace( newLocation );
  fireGAEvent( 'Authorisation', 'Performing auto-login with ' + loginMethod );
  return;
};
