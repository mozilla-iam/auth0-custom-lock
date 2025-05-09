var ui = require( 'helpers/ui' );

module.exports = function checkIfHeaderBannerPre( banner ) {
  var header_banner_pre = NLX.features.header_banner_pre;

  if ( header_banner_pre === 'true' && window.localStorage.getItem('header-banner-pre') != 1 ) {
    ui.show( banner );
  }
};
