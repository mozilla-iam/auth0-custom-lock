// define handlers
//
// handlers are functions that run when a user clicks an interactive
// element with data-handler="function-name"

// handlers are in the folder of the component they relate to. If they relate to
// no component, they are in the general 'handlers' folder (src/assets/js/handlers).

module.exports = {
  'enter': require( 'handlers/enter' ),
  'go-to-initial-page': require( 'handlers/go-to-initial-page' ),
  'authorise-ldap': require( 'handlers/authorise-ldap' ),
  'authorise-github': require( 'handlers/authorise-github' ),
  'authorise-google': require( 'handlers/authorise-google' )
};

