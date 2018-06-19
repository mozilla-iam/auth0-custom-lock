var switchClass = function( input ) {
  if ( input.value.length > 0 ) {
    input.classList.add( 'has-contents' );
  }
  else {
    input.classList.remove( 'has-contents' );
  }
};

module.exports = function watchContents( input ) {
  switchClass( input );

  input.addEventListener( 'keyup', function() {
    switchClass( input );
  });

  input.addEventListener( 'change', function() {
    switchClass( input );
  });
};
