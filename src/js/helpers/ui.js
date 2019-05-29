var ui = {
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
  // toggle visibility of `element`
  toggle: function( element ) {
    if ( !ui.isHidden( element ) ) {
      element.setAttribute( 'hidden', true );
    }
    else {
      element.removeAttribute( 'hidden' );
    }
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
        element.setAttribute( 'tabindex', '-1' );
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
  },
  // basic way of getting focusable elements in `baseElement`
  getFocusableElements: function( baseElement ) {
    var dom = require( 'helpers/dom' );

    return dom.$( 'a[href], button, input[type="text"], input[type="email"], input[type="password"], input[type="radio"], input[type="checkbox"], select', baseElement );
  },
  // set lock state, where all screens are all divs
  // with the 'data-screen' attribute and the new state
  // name identifies one specific div (by corresponding
  // with its 'id' attribute)
  setLockState: function( element, state ) {
    var dom = require( 'helpers/dom' );
    var form = element.tagName === 'FORM' ? element : element.form;
    var screens = dom.$( '[data-screen]', form );
    var screenToShow = document.getElementById( state );
    var autofocusInput = dom.$( '[autofocus]', screenToShow );

    if ( screenToShow ) {

      // hide all screens
      screens.forEach( function( screen ) {
        ui.hide( screen );
      });

      // show and focus screenToShow
      ui.show( screenToShow, screenToShow );
      form.setAttribute( 'lock-state', state );

      if ( autofocusInput && autofocusInput.length > 0 ) {
        setTimeout( function() {
          autofocusInput[0].focus();
        }, 100 );
      }
    }
  }
};

module.exports = ui;
