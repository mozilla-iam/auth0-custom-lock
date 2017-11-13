module.exports = function( handlers ) {

  document.addEventListener( 'click', function handleClick( event ) {
    var element = event.target;
    var handler = ( element.getAttribute( 'data-handler' ) || '' ).toLowerCase();
    var isDisabled = element.getAttribute( 'aria-disabled' ) === 'true';

    // no handler, bail early
    if ( !handler ) {
      return;
    }

    // honor clicks with modifier keys
    if ( element.nodeName === 'A' && ( event.shiftKey || event.metaKey || event.ctrlKey ) ) {
      return true;
    }

    // dismiss clicks on aria-disabled="true" elements
    if ( isDisabled ) {
      event.preventDefault();
      return;
    }

    handler.split( /\s+/ ).forEach( function( handlerName ) {
      if ( handlers[handlerName] instanceof Function ) {
        handlers[handlerName]( element, event );
      }
    });

  });
};
