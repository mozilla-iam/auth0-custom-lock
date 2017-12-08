module.exports = function autoLogin() {
  /* Ugly hack to auto log you in. Only works with LDAP in this case */
  var w = window.location.toString();

  if ( w.indexOf( 'tried_silent_auth=true' ) === -1 ) {
    window.location = w.replace( '/login?', '/authorize?' ).replace( '?client=', '?client_id=' ) + '&sso=true&connection=Mozilla-LDAP-Dev&tried_silent_auth=true';
  }
};
