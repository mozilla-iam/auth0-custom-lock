var ui = require( 'helpers/ui' );

var dom = {
  // convenience function that returns an Array of elements that matches selectors
  $: function( selectors, baseElement ) {
    var elements = ( baseElement || document ).querySelectorAll( selectors );

    return Array.prototype.slice.call( elements );
  }
};

module.exports = dom;
