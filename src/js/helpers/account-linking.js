var accountLinkingValue = 'nlx-start-account-linking';

var accountLinking = {
  isAccountLinking: function() {
    return window.location.href.indexOf( 'account_linking=true' ) >= 0;
  },
  didAccountLinking: function() {
    return window.localStorage.getItem( accountLinkingValue );
  },
  save: function() {
    // remove existing
    if ( accountLinking.didAccountLinking() ) {
      window.localStorage.removeItem( accountLinkingValue );
    }
    // check if needs to be set
    if ( accountLinking.isAccountLinking() ) {
      window.localStorage.setItem( accountLinkingValue, 'true' );
    }
  },
}

module.exports = accountLinking;
