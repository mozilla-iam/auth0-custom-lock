function getConfig( string ) {
  var config;
  var isHostedLock = string !== '@@' + 'config@@'; // if the string isn't this, we're not in the hosted Lock

  if ( isHostedLock )  {
    config = JSON.parse(decodeURIComponent(escape(window.atob(string))));
    config.domain = config.auth0Domain;
    config.responseType = config.internalOptions.response_type;
    config.redirectUri = config.callbackURL;
  } else {
    config = {
      'domain': 'auth-dev.mozilla.auth0.com',
      'auth0Domain': 'auth-dev.mozilla.auth0.com',
      'redirectUri': 'http://localhost:3000/callback',
      'responseType': 'token',
    }
  }
  return config;
}

module.exports = function initAuth( element ) {
  var auth0 = require( 'auth0-js' );
  var config = getConfig( '@@config@@' );
  var params = Object.assign( {
    domain: config.auth0Domain,
    clientID: config.clientID,
    redirectUri: config.callbackURL,
    responseType: 'code'
  }, config.internalOptions );
  var webAuth = new auth0.WebAuth( params );

  element.webAuth = webAuth;
  element.webAuthConfig = config;
}
