module.exports = function() {
  var getRPName = require( 'helpers/getRPName' );
  var rp = getRPName();
  var rpLocation = document.getElementById( 'rp-name-placeholder' );

  if ( rp && rpLocation ) {
    rpLocation.textContent = rp;
  }
};
