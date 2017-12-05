var ui = require( 'helpers/ui' );

var dom = {
  // convenience function that returns an Array of elements that matches selectors
  $: function( selectors, baseElement ) {
    var elements = ( baseElement || document ).querySelectorAll( selectors );

    return Array.prototype.slice.call( elements );
  },
  // find out if an element is visible, uses ui#isHidden
  isVisibleElement: function( element ) {
    var CHECK_FOR_HIDDEN_PARENTS = true;

    // only return elements that are not hidden and not inside a hidden parent
    return !ui.isHidden( element, CHECK_FOR_HIDDEN_PARENTS );
  }
};

module.exports = dom;
