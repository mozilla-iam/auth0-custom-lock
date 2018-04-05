var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var autologin = require( 'helpers/autologin' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://' + NLX.auth0_domain + '/public/api/' + form.webAuthConfig.clientID + '/connections';
  var requiresPrompt = window.location.href.indexOf( 'prompt=login' ) >= 0 || window.location.href.indexOf( 'prompt=select_account' );
  var triedAutologin = window.location.href.indexOf( 'tried_autologin=true' ) >= 0;
  var autologinEnabled = requiresPrompt === -1 && NLX.features.autologin === 'true';
  var savedLoginMethod = window.localStorage.getItem( 'nlx-last-used-connection' );
  var accountLinking = require( 'helpers/account-linking' );
  var didAccountLinking = accountLinking.didAccountLinking();

  ui.setLockState( element, 'loading' );

  form.willRedirect = false;

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( supported ) {
    var loginMethods;
    var i;

    loginMethods = {
      'supportedByRP': [],
      'supportedByNLX': NLX.supportedLoginMethods,
      'removed': []
    };

    for ( i = 0; i < supported.length; i++ ) {
      loginMethods['supportedByRP'].push( supported[i].name );
    }

    loginMethods['supportedByNLX'].forEach( function( loginMethod ) {
      var rpSupportsSavedLoginMethod = savedLoginMethod && loginMethods['supportedByRP'].indexOf( savedLoginMethod ) >= 0;
      var optionsInDom;

      // Remove login options from page if not supported by RP
      if ( loginMethods['supportedByRP'].indexOf( loginMethod ) === -1 ) {
        optionsInDom = dom.$( '[data-optional-login-method="' + loginMethod + '"]' );

        optionsInDom.forEach( function( method ) {
          method.remove();
        });

        loginMethods['removed'].push( loginMethod );

        fireGAEvent( 'Hiding', 'Hiding login method that isn\'t supported for this RP' );
        fireGAEvent( 'Hiding', 'Hiding ' + loginMethod + ' as it isn\'t supported for this RP' );
      }

      // RPs that request autologin to happen with the prompt=none parameter,
      // will not see this page. As a fallback for RPs that don't use prompt=none,
      // we attempt autologin once, and only under circumstances
      if ( !didAccountLinking && !triedAutologin && autologinEnabled && rpSupportsSavedLoginMethod ) {
        autologin( savedLoginMethod, form );
        return;
      }
    });

    form.loginMethods = loginMethods;

    if ( didAccountLinking ) {
      accountLinking.clear();
    }
    else {
      accountLinking.save();
    }

    if ( !form.willRedirect ) {
      ui.setLockState( element, 'initial' );
    }
  }).catch( function() {
    // Could not check which connections are available for this RP; just show all.
    ui.setLockState( element, 'initial' );
  });
};
