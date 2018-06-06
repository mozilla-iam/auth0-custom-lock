module.exports = function( element ) {
  var originalHref = element.getAttribute( 'href' ); // avoid 'href' as it will also give host

  element.addEventListener( 'click', function( event ) {
    event.preventDefault();

    // we're opening the tooltip
    if ( element.getAttribute( 'href' ) === originalHref ) {
      element.setAttribute( 'href', '#' );
      window.location.hash = originalHref;
    }
    // we're closing the tooltip
    else {
      element.setAttribute( 'href', originalHref );
      window.location.hash = '';
    }
  });
};
