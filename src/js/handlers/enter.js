var ui = require( 'helpers/ui' );
var dom = require( 'helpers/dom' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var accountLinking = require( 'helpers//account-linking' );

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
  var form = document.querySelector( 'form' );
  var emailField = dom.getEmailField();
  var emailFieldValue = emailField.value.toLowerCase();
  var passwordField = document.getElementById( 'field-password' );
  var isAccountLinking = accountLinking.isAccountLinking();
  var qualifiesForLDAPShortcut = /@(mozilla\.com|getpocket\.com|mozillafoundation\.org)$/.test( emailField.value );
  var supportedByRP = form.loginMethods ? form.loginMethods['supportedByRP'] : null;
  var onlyAcceptsLDAP = supportedByRP && supportedByRP.length === 1 && supportedByRP.indexOf( NLX.LDAP_connection_name ) === 0;
  var ENDPOINT = 'https://' + NLX.person_api_domain + '/v2/user/metadata/';

  if ( emailField.value === '' || emailField.validity.valid === false ) {
    emailField.focus();
    return;
  }

  if ( qualifiesForLDAPShortcut && isAccountLinking === false ) {
    showLDAP( element, passwordField );
  }
  else {
    if ( NLX.features.person_api_lookup ) {

      ui.setLockState( element, 'loading' );

      fetch( ENDPOINT + emailFieldValue )
        .then(
          function( response ) {
            response.json().then( function( userinfo ) {
              if ( userinfo.exists.ldap ) {
                showLDAP( element, passwordField );
              }
              else {
                if ( onlyAcceptsLDAP ) {
                  ui.setLockState( element, 'ldap-required' );
                }
                else {
                  showNonLDAP( element );
                }
              }
            });
          }
      ).catch( function() {
        if ( onlyAcceptsLDAP ) {
          ui.setLockState( element, 'ldap-required' );
        }
        else {
          showNonLDAP( element );
        }
      });
    }
    else {
      if ( onlyAcceptsLDAP ) {
        ui.setLockState( element, 'ldap-required' );
      }
      else {
        showNonLDAP( element );
      }
    }
  }
};
