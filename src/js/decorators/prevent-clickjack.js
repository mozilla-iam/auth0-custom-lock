var fireGAEvent = require( 'helpers/fire-ga-event' );

module.exports = function() {
  if ( window.self !== window.top ) {
    document.body.style.display = 'none';
    fireGAEvent( 'Security', 'NLX was loaded inside iframe' );
  }
};
