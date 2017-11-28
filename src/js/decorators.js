// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-auth': require( 'decorators/init-auth' ),
  'enter-with-keyboard': require( 'decorators/enter-with-keyboard' )
};

module.exports = decorators;

