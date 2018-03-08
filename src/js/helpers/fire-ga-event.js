module.exports = function( eventCategory, eventAction ) {
  var TRACKER_NAME = 'gtm1';
  var getRPName = require( 'helpers/get-rp-name' );
  var RP = getRPName();

  if ( window.ga ) {
    ga( TRACKER_NAME + '.send', {
      'hitType': 'event',
      'eventCategory': eventCategory,
      'eventAction': eventAction,
      'eventLabel': RP
    });
  }
};
