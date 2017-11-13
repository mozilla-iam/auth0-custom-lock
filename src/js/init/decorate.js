module.exports = function decorate( decorators, baseElement ) {
  var dom = require( 'helpers/dom' );
  var WHITESPACE = /\s+/;

  dom.$( '[data-decorator]', baseElement || document ).forEach( function( element ) {
    var decoratorArr = element.getAttribute( 'data-decorator' )
      .toLowerCase()
      .split( WHITESPACE );

    decoratorArr.forEach( function( decorator ) {
      if ( typeof decorators[ decorator ] === 'function' ) {
        decorators[ decorator ]( element );
      }
    });
  });
};
