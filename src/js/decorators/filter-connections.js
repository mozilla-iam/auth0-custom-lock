var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://auth-dev.mozilla.auth0.com/public/api/' + form.webAuthConfig.clientID + '/connections';

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

      if ( allowedRPs.indexOf( functionalityName ) === -1 ) {
        ui.hide( functionality );
      }
    });

    if ( window.location.hostname !== 'localhost' && window.localStorage ) {
      var lastUsedConnection = window.localStorage.getItem( 'nlx-last-used-connection' );
      var w = window.location.toString();
      var silentAuthEnabled = w.indexOf('tried_silent_auth=true') === -1;

      if ( silentAuthEnabled && lastUsedConnection && allowedRPs.indexOf( lastUsedConnection ) >= 0 ) {
        window.location = w.replace('/login?', '/authorize?').replace('?client=', '?client_id=') + '&sso=true&connection=' + lastUsedConnection + '&tried_silent_auth=true'
        return
      }
    }

    ui.setLockState( element, 'initial' );
  }, function(){
    ui.setLockState( element, 'initial' );
  });
};
