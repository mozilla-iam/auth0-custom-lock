function getConfig( string ) {
  var config = {};
  var hostedConfig;
  var isHostedLock = string !== '@@' + 'config@@'; // if the string isn't this, we're not in the hosted Lock

  if ( isHostedLock ) {
    hostedConfig = string;
    config.domain = hostedConfig.auth0Domain;
    config.clientID = hostedConfig.clientID;
    config.redirectUri = hostedConfig.callbackURL;
    config.responseType = 'code';
    config = Object.assign( config, hostedConfig.internalOptions );
  }
  else {
    config.domain = NLX.domain;
    config.clientID = NLX.client_ID;
    config.responseType = 'code';
  }
  return config;
}

module.exports = function initAuth( element ) {
  var auth0 = require( 'auth0-js' );
  console.log ( '--- hosted config --');
  console.log ( NLX.hostedConfig );
  console.log ( '--- hosted config --');
  var config = getConfig( NLX.hostedConfig );
  var webAuth = new auth0.WebAuth( config );

  element.webAuth = webAuth;
  element.webAuthConfig = config;
};
