// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-auth': require( 'decorators/init-auth' ),
  'continue-with-keyboard': require( 'decorators/continue-with-keyboard' ),
  'auto-login': require( 'decorators/auto-login' ),
  'set-focus-to-input': require( 'decorators/set-focus-to-input' ),
  'load-ga': require( 'decorators/load-ga' ),
  'handle-submit': require( 'decorators/handle-submit' )
};

module.exports = decorators;

