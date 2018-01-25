var authoriseLDAP = require( 'handlers/authorise-ldap' );
var enter = require( 'handlers/enter' );

module.exports = function( element ) {

  element.addEventListener( 'submit', function( event ) {
    var currentState = element.getAttribute( 'lock-state' );

    event.preventDefault();

    switch ( currentState ) {
      case 'initial':
        enter( element );
        break;
      case 'ldap':
      case 'error-password':
        authoriseLDAP( element );
        break;
    }
  });
};
