var accountLinkingValue = 'nlx-start-account-linking';

var accountLinking = {
  isAccountLinking: function() {
    return window.location.href.indexOf( 'account_linking=true' ) >= 0;
  },
  didAccountLinking: function() {
    return window.localStorage.getItem( accountLinkingValue ) === 'true' ? true : false;
  },
  save: function() {
    // check if needs to be set
    if ( accountLinking.isAccountLinking() ) {
      window.localStorage.setItem( accountLinkingValue, 'true' );
    }
  },
  clear: function() {
    window.localStorage.removeItem( accountLinkingValue );
  }
};

module.exports = accountLinking;
