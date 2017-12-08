// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-auth': require( 'decorators/init-auth' ),
  'continue-with-keyboard': require( 'decorators/continue-with-keyboard' ),
  'auto-login': require( 'decorators/auto-login' )
};

module.exports = decorators;

