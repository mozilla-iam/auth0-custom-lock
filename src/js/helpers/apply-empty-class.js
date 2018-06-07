var dom = require( 'helpers/dom' );

module.exports = function() {
  var loginOptions = dom.$( '.login-options' );

  loginOptions.forEach( function( optionsList ) {
    if ( optionsList.children.length === 0 ) {
      optionsList.classList.add( 'login-options--empty' );
    }
    else {
      optionsList.classList.remove( 'login-options--empty' );
    }
  });
};
