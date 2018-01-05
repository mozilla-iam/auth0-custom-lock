var dntEnabled = require( 'helpers/dntEnabled' );

module.exports = function() {

  if ( dntEnabled === false ) {
    var firstScriptTag = document.getElementsByTagName( 'script' )[0];
    var scriptTag = document.createElement( 'script' );
    var ID = 'GTM-T2N2BRW';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    scriptTag.async = true;
    scriptTag.src = 'https://www.googletagmanager.com/gtm.js?id=' + ID;

    firstScriptTag.parentNode.insertBefore( scriptTag, firstScriptTag );
  }
}
