var fireGTMEvent = require( 'helpers/fireGTMEvent' );

module.exports = function authorise( element ) {
  var form = element.closest( 'form' );

  fireGTMEvent( 'Authorisation', 'Authorising with GitHub' );

  form.webAuth.authorize({
    responseType: 'token',
    connection: 'github'
  });
};
