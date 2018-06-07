var checkDntEnabled = require( 'helpers/dnt-enabled' );
var dntEnabled = checkDntEnabled();

module.exports = function() {
  var firstScriptTag;
  var scriptTag;

  if ( dntEnabled === false ) {
    firstScriptTag = document.getElementsByTagName( 'script' )[0];
    scriptTag = document.createElement( 'script' );

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    scriptTag.async = true;
    scriptTag.src = 'https://www.googletagmanager.com/gtm.js?id=' + NLX.GTM_ID;

    firstScriptTag.parentNode.insertBefore( scriptTag, firstScriptTag );
  }
};
