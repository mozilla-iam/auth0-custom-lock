var ui = {
  // toggle visibility of `element`
  toggle: function( element ) {
    if ( !ui.isHidden( element ) ) {
      element.setAttribute( 'hidden', true );
    }
    else {
      element.removeAttribute( 'hidden' );
    }
  },
  // hide `element`
  hide: function( element, focusElement ) {
    if ( !ui.isHidden( element ) ) {
      element.setAttribute( 'hidden', true );
    }
    ui.focus( focusElement );
  },
  // show `element`
  show: function( element, focusElement ) {
    if ( ui.isHidden( element ) ) {
      element.removeAttribute( 'hidden' );
    }
    ui.focus( focusElement );
  },
  // check if `element` is hidden
  isHidden: function( element, checkForHiddenParents ) {
    var hasHiddenParents = false;

    if ( checkForHiddenParents ) {
      hasHiddenParents = !!element.closest( '[hidden]' );
    }
    return element.hasAttribute( 'hidden' ) || checkForHiddenParents && hasHiddenParents;
  },
  // focus `element`
  focus: function( element ) {
    if ( element ) {
      if ( element.nodeName === 'DIV' && !element.hasAttribute( 'tabindex' ) ) {
        element.setAttribute( 'tabindex', '0' );
      }
      if ( typeof element.focus === 'function' ) {
        if ( window.requestAnimationFrame ) {
          window.requestAnimationFrame( function() {
            element.focus();
          });
        }
        else {
          element.focus();
        }
      }
    }
  }};

module.exports = ui;
