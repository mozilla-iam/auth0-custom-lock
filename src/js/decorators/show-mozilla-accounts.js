var ui = require( 'helpers/ui' );

module.exports = function showMozillaAccounts( accounts ) {
  var mozilla_accounts_banner_post = NLX.features.mozilla_accounts_banner_post;
  var firefox_accounts = document.getElementById('firefoxaccounts');

  if ( mozilla_accounts_banner_post  === 'true') {
    ui.show( accounts );
    ui.hide( firefox_accounts );
  }
};
