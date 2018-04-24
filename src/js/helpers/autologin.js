var fireGAEvent = require( 'helpers/fire-ga-event' );

module.exports = function autologin( loginMethod, form ) {
  var visualStatusReport = document.getElementById( 'loading__status' );
  var newLocation;

  form.willRedirect = true;
  visualStatusReport.textContent = 'Attempting auto-login with ' + loginMethod;

  newLocation = window.location.toString().replace( '/login?', '/authorize?' ).replace( '?client=', '?client_id=' ) + '&sso=true&connection=' + loginMethod + '&tried_autologin=true';

  window.location.replace( newLocation );
  fireGAEvent( 'Authorisation', 'Performing auto-login with ' + loginMethod );
  return;
};
