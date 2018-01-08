module.exports = function() {

  // Object.assign
  if ( typeof Object.assign != 'function' ) {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty( Object, "assign", {
      value: function assign( target, varArgs ) { // .length of function is 2
        'use strict';
        if ( target == null ) { // TypeError if undefined or null
          throw new TypeError( 'Cannot convert undefined or null to object' );
        }

        var to = Object( target );

        for ( var index = 1; index < arguments.length; index++ ) {
          var nextSource = arguments[ index ];

          if ( nextSource != null ) { // Skip over if undefined or null
            for ( var nextKey in nextSource ) {
              // Avoid bugs when hasOwnProperty is shadowed
              if ( Object.prototype.hasOwnProperty.call( nextSource, nextKey ) ) {
                to[ nextKey ] = nextSource[ nextKey ];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

  if ( !Element.prototype.matches ) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  if ( !Element.prototype.closest ) {
    Element.prototype.closest = function(s) {
      var el = this;

      if ( !document.documentElement.contains( el ) ) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null);
        return null;
    };
  }
};
