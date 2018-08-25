var dom = require( 'helpers/dom' );

module.exports = function() {
  var loginOptions = dom.$( '.login-options' );

  loginOptions.forEach( function( optionsList ) {
    if ( optionsList.children.length === 0 ) {
      optionsList.classList.add( 'login-options--empty' );

      // do not show grey line before empty options list
      if ( optionsList.previousElementSibling.nodeName === 'HR' ) {
        optionsList.previousElementSibling.style.display = 'none';
      }
    }
    else {
      optionsList.classList.remove( 'login-options--empty' );
    }
  });
};
