module.exports = function( connectionName ) {
  if ( window.localStorage ) {
    window.localStorage.setItem( 'nlx-last-used-connection', connectionName );
  }
};
