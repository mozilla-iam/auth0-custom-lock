module.exports = function checkKeyboard() {
  document.addEventListener( 'keydown', function( e ) {
    if ( e.key === 'Tab' ) {
      document.body.classList.add( 'focus-styles' );
    }
  });
};
