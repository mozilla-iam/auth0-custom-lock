var fireGAEvent = require( 'helpers/fire-ga-event' );
var trustedUrls = [ 'https://fxa-support-panel.stage.mozaws.net/' ];

module.exports = function() {
  if ( window.self !== window.top ) {
    fireGAEvent( 'Security', 'NLX was loaded inside iframe: ' + window.self );
    for (var i = 0; i < trustedUrls.length; i++) {
      if (window.location.href.startsWith(trustedUrls[i])) {
        fireGAEvent( 'Security', 'NLX was loaded inside a trusted iframe' );
        return;
      }
    }

    fireGAEvent( 'Security', 'Hiding NLX' );
    document.body.style.display = 'none';
  }
};
