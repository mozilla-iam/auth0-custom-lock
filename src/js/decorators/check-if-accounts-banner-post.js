var ui = require( 'helpers/ui' );

module.exports = function checkIfAccountBannerPost( banner ) {
  var mozilla_accounts_banner_post = NLX.features.mozilla_accounts_banner_post;

  if ( mozilla_accounts_banner_post === 'true' && window.localStorage.getItem('mozilla-accounts-banner-post') != 1 ) {
    ui.show( banner );
  }
};
