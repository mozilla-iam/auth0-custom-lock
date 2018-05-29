var fireGAEvent = require( 'helpers/fire-ga-event' );

module.exports = function() {
  console.log( 'self: ');
  console.log( window.self );
  console.log( 'top: ' );
  console.log( window.top );
  if ( window.self !== window.top ) {
    document.body.classList.add( 'pppppp' );
    document.body.style.display = 'none';
    fireGAEvent( 'Security', 'NLX was loaded inside iframe' );
  }
  if ( window.self === window.top ) {
    document.body.classList.add( 'notframed' );
  }
}
