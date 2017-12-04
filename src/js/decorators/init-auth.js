function getConfig( string ) {
  var config;
  var isHostedLock = string !== '@@' + 'config@@'; // if the string isn't this, we're not in the hosted Lock

  if ( isHostedLock )  {
    config = JSON.parse(decodeURIComponent(escape(window.atob(string))));
  } else {
    config = {
      'domain': 'auth-dev.mozilla.auth0.com',
      'clientID': 'redacted',
      'clientSecret': 'redacted',
      'auth0Domain': 'auth-dev.mozilla.auth0.com',
      // 'callbackOnLocationHash': false,
      // 'callbackURL': 'http://localhost:3000/callback',
      // 'cdn': 'https://rta-dev.mozilla.auth0.com/',
      // 'clientID': 'IxJG9EkWRwW9Zo2a7VoLwndTqrpN7Aln', // Default App
      // 'dict': { 'signin': { 'title' : 'Default App' } },
      'responseType': 'token',
      // 'extraParams': {},
      // 'internalOptions': {},
      // 'prompt': false,
      // 'widgetUrl': 'https://cdn.auth0.com/w2/auth0-widget-5.2.min.js'
    }
  }
  return config;
}

module.exports = function initAuth( element ) {
  var auth0 = require( 'auth0-js' );
  var config = getConfig( '@@config@@' );

  console.log( config );
  var webAuth = new auth0.WebAuth( config );

  element.webAuth = webAuth;
}
