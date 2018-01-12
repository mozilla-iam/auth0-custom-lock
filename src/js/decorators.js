// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-auth': require( 'decorators/init-auth' ),
  'continue-with-keyboard': require( 'decorators/continue-with-keyboard' ),
  'auto-login': require( 'decorators/auto-login' ),
  'load-ga': require( 'decorators/load-ga' ),
  'handle-submit': require( 'decorators/handle-submit' ),
  'display-rp-name': require( 'decorators/display-rp-name' )
};

module.exports = decorators;

