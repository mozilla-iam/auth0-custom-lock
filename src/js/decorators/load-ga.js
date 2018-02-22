var checkDntEnabled = require( 'helpers/dntEnabled' );
var dntEnabled = checkDntEnabled();

module.exports = function() {
  var firstScriptTag;
  var scriptTag;
  var ID;

  if ( dntEnabled === false ) {
    firstScriptTag = document.getElementsByTagName( 'script' )[0];
    scriptTag = document.createElement( 'script' );
    ID = '{{{ GTM_ID }}}';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    scriptTag.async = true;
    scriptTag.src = 'https://www.googletagmanager.com/gtm.js?id=' + ID;

    firstScriptTag.parentNode.insertBefore( scriptTag, firstScriptTag );
  }
};
