var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://' + NLX.auth0_domain + '/public/api/' + form.webAuthConfig.clientID + '/connections';
  var visualStatusReport = document.getElementById( 'loading__status' );
  var willRedirect = false;
  var loginIntro = document.getElementById( 'initial-login-text' );

  ui.setLockState( element, 'loading' );

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( allowed ) {
    var allowedRPs = [];
    var RPfunctionalities = dom.$( '[data-optional-rp]' );
    var removedFunctionalities = [];
    var i;

    for ( i = 0; i < allowed.length; i++ ) {
      allowedRPs.push( allowed[i].name );
    }

    RPfunctionalities.forEach( function( functionality ) {
      var functionalityName = functionality.getAttribute( 'data-optional-rp' );
      var locationString = window.location.toString();
      var isAccountLinking = locationString.indexOf( 'account_linking=true' ) >= 0;
      var triedSilentAuth = locationString.indexOf( 'tried_silent_auth=true' ) >= 0;
      var silentAuthEnabled = !isAccountLinking && !triedSilentAuth && NLX.features.autologin === 'true';
      var lastUsedConnection = lastUsedConnection = window.localStorage.getItem( 'nlx-last-used-connection' ) || '';
      var newLocation;

      if ( allowedRPs.indexOf( functionalityName ) === -1 ) {
        functionality.remove();
        removedFunctionalities.push( functionalityName );

        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
      }

      if ( silentAuthEnabled ) {

        if ( lastUsedConnection && allowedRPs.indexOf( lastUsedConnection ) >= 0 ) {
          willRedirect = true;
          visualStatusReport.textContent = 'Autologging in with ' + lastUsedConnection;

          newLocation = locationString.replace( '/login?', '/authorize?' ).replace( '?client=', '?client_id=' ) + '&sso=true&connection=' + lastUsedConnection + '&tried_silent_auth=true';
          window.location.replace( newLocation );
          fireGAEvent( 'Authorisation', 'Performing auto-login with ' + lastUsedConnection );
        }
      }
    });

    if ( !willRedirect ) {
      ui.setLockState( element, 'initial' );
    }

    if ( removedFunctionalities.indexOf( 'github' ) > 0 && removedFunctionalities.indexOf( 'google-oauth2' ) > 0 ) {
      loginIntro.querySelector( 'span' ).style.display = 'none';
    }
  }).catch( function() {
    // Could not check which connections are available for this RP; just show all.
    ui.setLockState( element, 'initial' );
  });
};
