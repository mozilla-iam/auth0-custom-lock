var ui = require( 'helpers/ui' );
var accountLinking = require( 'helpers/account-linking' );


module.exports = function( element ) {
  if ( accountLinking.isAccountLinking() ) {
    ui.hide( element );
  }
console.log('bla');
};
