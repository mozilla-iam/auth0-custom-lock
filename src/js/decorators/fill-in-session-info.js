module.exports = function fillInSessioInfo( p ) {
  var params = new URLSearchParams( window.location.search ) || null;
  var email = p.querySelector( '[data-email]' );
  var loginMethod = p.querySelector( '[data-login-method]' );

  if ( params.get( 'user_email' ) ) {
    email.querySelector( 'strong' ).textContent = params.get( 'user_email' );
    email.removeAttribute( 'hidden' );
  }

  if ( params.get( 'user_login_method' ) ) {
    loginMethod.querySelector( 'strong' ).textContent = params.get( 'user_login_method' );
    loginMethod.removeAttribute( 'hidden' );
  }
};
