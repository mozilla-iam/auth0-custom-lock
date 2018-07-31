var dom = require( 'helpers/dom' );
var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fire-ga-event' );
var autologin = require( 'helpers/autologin' );
var applyEmptyClass = require( 'helpers/apply-empty-class' );
var accountLinking = require( 'helpers/account-linking' );
var hasParams = require( 'helpers/has-params' );

module.exports = function( element ) {
  var form = element.form;
  var url = 'https://' + NLX.domain + '/public/api/' + form.webAuthConfig.clientID + '/connections';
  var usedBackButton = window.performance && window.performance.navigation.type === 2;
  var savedLoginMethod = window.localStorage.getItem( 'nlx-last-used-connection' );
  var savedTimeStamp = parseInt( window.localStorage.getItem( 'nlx-last-autologin-time' ) );
  var didAccountLinking = accountLinking.didAccountLinking();
  var timeStamp = new Date().getTime();
  var shouldAutologin = true;

  ui.setLockState( element, 'loading' );

  form.willRedirect = false;

  if ( hasParams( 'prompt=login' ) || hasParams( 'prompt=select_account' ) ||
    hasParams( 'account_verification=true' ) || hasParams( 'tried_autologin=true' ) ) {
    fireGAEvent( 'Auto-login', 'Is verifying account, already tried autologin or has prompt set to login or select_account, aborting auto-login' );
    shouldAutologin = false;
  }

  else if ( usedBackButton ) {
    fireGAEvent( 'Auto-login', 'Used back button to return, aborting auto-login' );
    shouldAutologin = false;
  }

  else if ( ( timeStamp - savedTimeStamp ) < 600000 ) {
    fireGAEvent( 'Auto-login', 'Already auto-logged in in last ten minutes, aborting auto-login' );
    shouldAutologin = false;
  }

  fetch( url ).then( function( response ) {
    return response.json();
  }).then( function( supported ) {
    var loginMethods;
    var i;

    loginMethods = {
      'supportedByRP': [],
      'supportedByNLX': NLX.supportedLoginMethods.split( ',' ),
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
      if ( !didAccountLinking && rpSupportsSavedLoginMethod && shouldAutologin ) {
        autologin( savedLoginMethod, form );
        return;
      }
      else if ( rpSupportsSavedLoginMethod && shouldAutologin ) {
        fireGAEvent( 'Authorisation', 'Autologin did not succeed with ' + loginMethod );
      }
    });

    form.loginMethods = loginMethods;

    if ( didAccountLinking ) {
      accountLinking.clear();
    }
    else {
      accountLinking.save();
    }

    applyEmptyClass();

    if ( !form.willRedirect ) {
      ui.setLockState( element, 'initial' );
    }
  }).catch( function() {
    // Could not check which connections are available for this RP; just show all.
    ui.setLockState( element, 'initial' );
  });
};
