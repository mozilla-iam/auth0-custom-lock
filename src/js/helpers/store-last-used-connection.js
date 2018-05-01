var accountLinking = require( 'helpers/account-linking' );

module.exports = function( connectionName ) {
  var isAccountLinking = accountLinking.isAccountLinking();
  var preventAutologin = localStorage.getItem( 'nlx-prevent-autologin' ) !== null;

  if ( !isAccountLinking && !preventAutologin ) {
    window.localStorage.setItem( 'nlx-last-used-connection', connectionName );
  }
};
