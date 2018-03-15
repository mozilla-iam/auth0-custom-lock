var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var autologin = require( 'helpers/autologin' );
var accountLinking = require( 'helpers/account-linking' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://' + NLX.auth0_domain + '/public/api/' + form.webAuthConfig.clientID + '/connections';
  var loginIntro;
  var requiresPrompt = window.location.href.indexOf( 'prompt=login' ) >= 0 || window.location.href.indexOf( 'prompt=select_account' );
  var triedAutologin = window.location.href.indexOf( 'tried_autologin=true' ) >= 0;
  var autologinEnabled = requiresPrompt === -1 && NLX.features.autologin === 'true';
  var savedLoginMethod = window.localStorage.getItem( 'nlx-last-used-connection' );
  var didAccountLinking = accountLinking.didAccountLinking;

  ui.setLockState( element, 'loading' );

  form.willRedirect = false;

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( supported ) {
    var loginMethods;
    var i;

    loginMethods = {
      'supportedByRP': [],
      'supportedByNLX': dom.$( '[data-optional-login-method]' ),
      'removed': []
    };

    for ( i = 0; i < supported.length; i++ ) {
      loginMethods['supportedByRP'].push( supported[i].name );
    }

    loginMethods['supportedByNLX'].forEach( function( loginMethod ) {
      var thisLoginMethod = loginMethod.getAttribute( 'data-optional-login-method' );
      var rpSupportsSavedLoginMethod = savedLoginMethod && loginMethods['supportedByRP'].indexOf( savedLoginMethod ) >= 0;

      // Remove login options from page if not supported by RP
      if ( loginMethods['supportedByRP'].indexOf( thisLoginMethod ) === -1 ) {
        loginMethod.remove();
        loginMethods['removed'].push( thisLoginMethod );

        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
        fireGAEvent( 'Hiding', 'Hiding ' + thisLoginMethod + ' as it isn\'t supported for this RP' );
      }

      // RPs that request autologin to happen with the prompt=none parameter,
      // will not see this page. As a fallback for RPs that don't use prompt=none,
      // we attempt autologin once
      if ( !didAccountLinking && !triedAutologin && autologinEnabled && rpSupportsSavedLoginMethod ) {
        autologin( savedLoginMethod, form );
      }
    });

    form.loginMethods = loginMethods;

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
