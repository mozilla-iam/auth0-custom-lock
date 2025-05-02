// define decorators
//
// decorators are functions that run when the page loads

var decorators = {
  'check-if-maintenance-mode': require( 'decorators/check-if-maintenance-mode' ),
  'check-if-header-banner-pre': require( 'decorators/check-if-header-banner-pre' ),
  'check-keyboard': require( 'decorators/check-keyboard' ),
  'decide-screen': require( 'decorators/decide-screen' ),
  'display-rp-name': require( 'decorators/display-rp-name' ),
  'fill-in-session-info': require( 'decorators/fill-in-session-info' ),
  'filter-connections': require( 'decorators/filter-connections' ),
  'handle-submit': require( 'decorators/handle-submit' ),
  'hide-autologin-setting-conditionally': require( 'decorators/hide-autologin-setting-conditionally' ),
  'init-auth': require( 'decorators/init-auth' ),
  'load-ga': require( 'decorators/load-ga' ),
  'prevent-clickjack': require( 'decorators/prevent-clickjack' ),
  'track-password-manager-usage': require( 'decorators/track-password-manager-usage' ),
  'set-autologin-preference': require( 'decorators/set-autologin-preference' ),
  'submit-with-enter': require( 'decorators/submit-with-enter' ),
  'tooltip': require( 'decorators/tooltip' ),
  'watch-contents': require( 'decorators/watch-contents' )
};

module.exports = decorators;

