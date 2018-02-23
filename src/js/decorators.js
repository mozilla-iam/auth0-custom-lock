// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'init-auth': require( 'decorators/init-auth' ),
  'submit-with-enter': require( 'decorators/submit-with-enter' ),
  'load-ga': require( 'decorators/load-ga' ),
  'handle-submit': require( 'decorators/handle-submit' ),
  'display-rp-name': require( 'decorators/display-rp-name' ),
  'filter-connections': require( 'decorators/filter-connections' )
};

module.exports = decorators;

