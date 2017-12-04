var isLDAP = require( 'helpers/isLDAP' );
var ui = require( 'helpers/ui' );

module.exports = function enter( element ) {
  var form = element.form;
  var emailField = document.getElementById( 'field-email' );

  if ( isLDAP( emailField.value ) ) {
    // show password field
    ui.setLockState( element, 'ldap' );
  }
  else {
    // show social logins + passwordless
    ui.setLockState( element, 'non-ldap' );
  }
}
