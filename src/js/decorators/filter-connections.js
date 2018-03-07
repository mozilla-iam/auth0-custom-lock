var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );
var autologin = require( 'helpers/autologin' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://' + NLX.auth0_domain + '/public/api/' + form.webAuthConfig.clientID + '/connections';
  var loginIntro;

  ui.setLockState( element, 'loading' );

  form.willRedirect = false;

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( supported ) {
    var loginMethods;
    var i;

    loginMethods = {
      'RP_supported': [],
      'NLX_supported': dom.$( '[data-optional-login-method]' ),
      'removed': []
    };

    for ( i = 0; i < supported.length; i++ ) {
      loginMethods['RP_supported'].push( supported[i].name );
    }

    loginMethods['NLX_supported'].forEach( function( loginMethod ) {
      var thisLoginMethod = loginMethod.getAttribute( 'data-optional-login-method' );
      var windowString = window.location.toString();
      var requiresPrompt = windowString.indexOf( 'prompt=login' ) >= 0 || windowString.indexOf( 'prompt=select_account' );
      var autologinEnabled = !requiresPrompt && NLX.features.autologin === 'true';
      var lastMethod = window.localStorage.getItem( 'nlx-last-used-connection' );
      var rpSupportsLastMethod = lastMethod && loginMethods['RP_supported'].indexOf( lastMethod ) >= 0;

      // Remove login options from page if not supported by RP
      if ( loginMethods['RP_supported'].indexOf( thisLoginMethod ) === -1 ) {
        loginMethod.remove();
        loginMethods['removed'].push( thisLoginMethod );

        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
      }

      // RPs that request autologin to happen with the prompt=none parameter,
      // will not see this page. As a fallback for RPs that don't use prompt=none,
      // we attempt autologin once
      if ( autologinEnabled && rpSupportsLastMethod ) {
        autologin( lastMethod );
      }
    });

    if ( !form.willRedirect ) {
      ui.setLockState( element, 'initial' );
    }

    if ( loginMethods['removed'].indexOf( 'github' ) >= 0 && loginMethods['removed'].indexOf( 'google-oauth2' ) >= 0 ) {
      loginIntro = document.getElementById( 'initial-login-text' );
      loginIntro.querySelector( 'span' ).style.display = 'none';
    }
  }).catch( function() {
    // Could not check which connections are available for this RP; just show all.
    ui.setLockState( element, 'initial' );
  });
};
