var accountLinking = require( 'helpers//account-linking' );

module.exports = function( connectionName ) {
  var isAccountLinking = accountLinking.isAccountLinking();

  if ( !isAccountLinking && window.localStorage ) {
    window.localStorage.setItem( 'nlx-last-used-connection', connectionName );
  }
};
