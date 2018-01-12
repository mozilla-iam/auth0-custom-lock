var fireGAEvent = require( 'helpers/fireGAEvent' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  fireGAEvent( 'Authorisation', 'Authorising with GitHub' );

  form.webAuth.authorize({
    responseType: 'token',
    connection: 'github'
  });
};
