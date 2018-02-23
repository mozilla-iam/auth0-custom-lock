var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function( element ) {
  var form = element.form;
  var url = '{{ auth0domain }}' + '/public/api/' + form.webAuthConfig.clientID + '/connections';

  ui.setLockState( element, 'loading' );

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( allowed ) {
    var allowedRPs = [];
    var RPfunctionalities = dom.$( '[data-optional-rp]' );
    var i;

    for ( i = 0; i < allowed.length; i++ ) {
      allowedRPs.push( allowed[i].name );
    }

    RPfunctionalities.forEach( function( functionality ) {
      var functionalityName = functionality.getAttribute( 'data-optional-rp' );
      var lastUsedConnection;
      var locationString;
      var silentAuthEnabled;

      if ( allowedRPs.indexOf( functionalityName ) === -1 ) {
        ui.hide( functionality );
        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
      }

      if ( window.location.hostname !== 'localhost' && window.localStorage ) {
        lastUsedConnection = window.localStorage.getItem( 'nlx-last-used-connection' );
        locationString = window.location.toString();
        silentAuthEnabled = locationString.indexOf('tried_silent_auth=true') === -1;

        if ( silentAuthEnabled && lastUsedConnection && allowedRPs.indexOf( lastUsedConnection ) >= 0 ) {
          window.location = locationString.replace('/login?', '/authorize?').replace('?client=', '?client_id=') + '&sso=true&connection=' + lastUsedConnection + '&tried_silent_auth=true';
          fireGAEvent( 'Authorisation', 'Performing auto-login' );

          return
        }
      }
    });

    ui.setLockState( element, 'initial' );
  }, function(){
    ui.setLockState( element, 'initial' );
  });
};
