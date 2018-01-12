module.exports = function() {
  var getRPName = require( 'helpers/getRPName' );
  var rp = getRPName();

  document.title = document.title + ' - ' + rp;
};
