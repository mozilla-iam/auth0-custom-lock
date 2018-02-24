var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function enter( element ) {
  var emailField = document.getElementById( 'field-email' );
  var passwordField = document.getElementById( 'field-password' );
  var isDefinitelyLDAP = /mozilla.com|getpocket.com|mozillafoundation.org$/.test( emailField.value );
  var ENDPOINT = NLX.person_api_domain;

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
    if ( NLX.features.person_api_lookup ) {

      ui.setLockState( element, 'loading' );

      fetch( ENDPOINT + emailField.value )
        .then(
          function( response ) {
            response.json().then( function( data ) {
              var userinfo = JSON.parse( data );
              var isLDAP = userinfo.hasOwnProperty( 'user_email' ) && userinfo.hasOwnProperty( 'connection_method' ) && userinfo[ 'connection_method' ] === 'ad';

              if ( isLDAP ) {

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
            });
          }
      );
    }
    else {
      // show social logins + passwordless
      ui.setLockState( element, 'non-ldap' );
      fireGAEvent( 'Screen change', 'Continued as non-LDAP' );
    }
  }
};


