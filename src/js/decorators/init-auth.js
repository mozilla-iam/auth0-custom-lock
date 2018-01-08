function getConfig( string ) {
  var config;
  var hostedConfig;
  var isHostedLock = string !== '@@' + 'config@@'; // if the string isn't this, we're not in the hosted Lock

  if ( isHostedLock )  {
    hostedConfig = JSON.parse( decodeURIComponent( escape( window.atob( string ) ) ) );
    config.domain = hostedConfig.auth0Domain;
    config.clientID = hostedConfig.clientID;
    config.redirectUri = hostedConfig.callbackURL;
    config.responseType = 'code';
    config = Object.assign( config, hostedConfig.internalOptions );
  }
  else {
    config = require( 'config/local-config-sample' );
  }
  return config;
}

module.exports = function initAuth( element ) {
  var auth0 = require( 'auth0-js' );
  var config = getConfig( '@@config@@' );
  var webAuth = new auth0.WebAuth( config );

  element.webAuth = webAuth;
  element.webAuthConfig = config;
}
