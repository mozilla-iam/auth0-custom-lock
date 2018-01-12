var isLDAP = require( 'helpers/isLDAP' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function enter( element ) {
  var emailField = document.getElementById( 'field-email' );
  var passwordField = document.getElementById( 'field-password' );

  if ( emailField.value === '' || emailField.validity.valid === false ) {
    emailField.focus();
    return;
  }

  if ( isLDAP( emailField.value ) ) {
    // show password field
    ui.setLockState( element, 'ldap' );
    // focus password field
    setTimeout( function() {
      passwordField.focus();
    }, 400 );

    fireGAEvent( 'Screen change', 'Continued as LDAP' );
  }
  else {
    // show social logins + passwordless
    ui.setLockState( element, 'non-ldap' );
    fireGAEvent( 'Screen change', 'Continued as non-LDAP' );
  }
};


