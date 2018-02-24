var authoriseLDAP = require( 'handlers/authorise-ldap' );

module.exports = function( element ) {
  var KEY_ENTER = 13;

  element.addEventListener( 'keyup', function( event ) {
    if ( event.which === KEY_ENTER && element.value.length > 0 ) {
      authoriseLDAP( element.form, false );
    }
  });
};
