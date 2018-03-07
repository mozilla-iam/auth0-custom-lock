module.exports = function autoLogin( loginMethod, form ) {
  var visualStatusReport = document.getElementById( 'loading__status' );
  var newLocation;

  form.willRedirect = true;
  visualStatusReport.textContent = 'Autologging in with ' + loginMethod;

  newLocation = window.location.toString().replace( '/login?', '/authorize?' ).replace( '?client=', '?client_id=' ) + '&sso=true&connection=' + loginMethod + '&prompt=none';

  window.location.replace( newLocation );
  fireGAEvent( 'Authorisation', 'Performing auto-login with ' + loginMethod );
  return;
};
