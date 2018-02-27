var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );

function showNonLDAP( element ) {
  // show social logins + passwordless
  ui.setLockState( element, 'non-ldap' );
  fireGAEvent( 'Screen change', 'Continued as non-LDAP' );
}

function showLDAP( element, passwordField ) {
  // show password field
  ui.setLockState( element, 'ldap' );
  // focus password field
  setTimeout( function() {
    passwordField.focus();
  }, 400 );

  fireGAEvent( 'Screen change', 'Continued as LDAP' );
}

module.exports = function enter( element ) {
  var emailField = document.getElementById( 'field-email' );
  var passwordField = document.getElementById( 'field-password' );
  var isDefinitelyLDAP = /mozilla.com|getpocket.com|mozillafoundation.org$/.test( emailField.value );
  var forceNonLDAP = window.location.toString().indexOf( 'forceNonLDAP=true' ) >= 0;
  var ENDPOINT = NLX.person_api_domain;

  if ( emailField.value === '' || emailField.validity.valid === false ) {
    emailField.focus();
    return;
  }

  if ( forceNonLDAP ) {
    showNonLDAP( element );
  }
  else if ( isDefinitelyLDAP ) {
    showLDAP( element, passwordField );
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
                showLDAP( element, passwordField );
              }
              else {
                showNonLDAP( element );
              }
            })
          }
      ).catch( function() {
        showNonLDAP( element );
      });
    }
    else {
      showNonLDAP( element );
    }
  }
};


