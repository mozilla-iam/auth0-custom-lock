module.exports = function() {
  var getRPName = require( 'helpers/get-rp-name' );
  var rp = getRPName();
  var rpLocation = document.getElementById( 'rp-name-placeholder' );

  if ( rp && rpLocation ) {
    rpLocation.textContent = rp;
  }
};
