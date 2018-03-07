var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );
var autologin = require( 'helpers/autologin' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://' + NLX.auth0_domain + '/public/api/' + form.webAuthConfig.clientID + '/connections';
  var form.willRedirect = false;
  var loginIntro = document.getElementById( 'initial-login-text' );

  ui.setLockState( element, 'loading' );

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( supported ) {
    var loginMethods = {
      'RP_supported': [],
      'NLX_supported': dom.$( '[data-optional-login-method]' ),
      'removed': []
    };
    var i;

    for ( i = 0; i < supported.length; i++ ) {
      loginMethods['RP_supported'].push( supported[i].name );
    }

    loginMethods['NLX_supported'].forEach( function( loginMethod ) {
      var thisLoginMethod = loginMethod.getAttribute( 'data-optional-login-method' );
      var isAccountLinking = window.location.toString().indexOf( 'account_linking=true' ) >= 0;
      var silentAuthEnabled = !isAccountLinking && NLX.features.autologin === 'true';
      var lastUsedLoginMethod = window.localStorage.getItem( 'nlx-last-used-connection' );
      var rpSupportsLastUsedLoginMethod = lastUsedLoginMethod && loginMethods['RP_supported'].indexOf( lastUsedLoginMethod ) >= 0;
      var newLocation;

      if ( loginMethods['RP_supported'].indexOf( thisLoginMethod ) === -1 ) {
        loginMethod.remove();
        loginMethods['removed'].push( thisLoginMethod );

        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
      }

      // RPs that request autologin to happen with the prompt=none parameter,
      // will not see this page. As a fallback for RPs that don't use prompt=none,
      // we attempt autologin once
      if ( silentAuthEnabled && rpSupportsLastUsedLoginMethod ) {
        autoLogin( lastUsedLoginMethod );
      }
    });

    if ( !form.willRedirect ) {
      ui.setLockState( element, 'initial' );
    }

    if ( loginMethods['removed'].indexOf( 'github' ) >= 0 && loginMethods['removed'].indexOf( 'google-oauth2' ) >= 0 ) {
      loginIntro.querySelector( 'span' ).style.display = 'none';
    }
  }).catch( function() {
    // Could not check which connections are available for this RP; just show all.
    ui.setLockState( element, 'initial' );
  });
};
