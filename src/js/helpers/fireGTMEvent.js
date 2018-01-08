module.exports = function( eventName ) {
  if ( window.dataLayer ) {
    dataLayer.push({
      'event': event
    });
  }
}
