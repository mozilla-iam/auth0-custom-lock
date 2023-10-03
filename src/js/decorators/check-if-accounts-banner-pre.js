var ui = require( 'helpers/ui' );

module.exports = function checkIfAccountBannerPre( banner ) {
  var mozilla_accounts_banner_pre = NLX.features.mozilla_accounts_banner_pre;

  if ( mozilla_accounts_banner_pre === 'true' ) {
    ui.show( banner );
  }
};
