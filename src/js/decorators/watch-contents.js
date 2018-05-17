module.exports = function watchContents( input ) {
  if ( input.value.length > 0 ) {
    input.classList.add( 'has-contents' );
  }

  input.addEventListener( 'keyup', function() {
    if ( input.value.length > 0 ) {
      input.classList.add( 'has-contents' );
    }
    else {
      input.classList.remove( 'has-contents' );
    }
  });
};
