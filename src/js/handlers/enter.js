var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function enter( element ) {
  var emailField = document.getElementById( 'field-email' );
  var passwordField = document.getElementById( 'field-password' );
  var isDefinitelyLDAP = /mozilla.com|getpocket.com$/.test( emailField.value );

  if ( emailField.value === '' || emailField.validity.valid === false ) {
    emailField.focus();
    return;
  }

  if ( isDefinitelyLDAP ) {
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


