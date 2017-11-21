module.exports = function initAuth( element ) {
  var auth0 = require( 'auth0-js' );
  var webAuth = new auth0.WebAuth({
    domain: 'hdv.eu.auth0.com',
    clientID: 'hxoMtYvGaZZi0PHddEf6A9VcijPS0aY5'
  });

  element.webAuth = webAuth;
}
