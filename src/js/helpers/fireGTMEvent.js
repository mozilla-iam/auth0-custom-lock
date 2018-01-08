module.exports = function( eventName ) {
  if ( window.dataLayer.length > 0 ) {
    dataLayer.push({
      'event': event
    });
  }
}
