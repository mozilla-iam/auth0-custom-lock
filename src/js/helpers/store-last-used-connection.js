module.exports = function( connectionName ) {
  var accountLinking = window.location.href.indexOf( 'account_linking=true' ) >= 0;

  if ( !accountLinking && window.localStorage ) {
    window.localStorage.setItem( 'nlx-last-used-connection', connectionName );
  }
};
