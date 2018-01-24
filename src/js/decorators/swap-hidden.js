var dom = require( 'helpers/dom' );

module.exports = function() {
  var fakeHiddenEls = dom.$( '[data-hidden]' );

  setTimeout( function(){
    fakeHiddenEls.forEach( function( element ) {
      element.removeAttribute( 'data-hidden' );
      element.setAttribute( 'hidden', '' );
    });
  }, 1000 );
}
