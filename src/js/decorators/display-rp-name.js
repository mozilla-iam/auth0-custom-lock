module.exports = function() {
  var getRPName = require( 'helpers/getRPName' );
  var rp = getRPName();

  document.title = rp + ' - ' + document.title;
};
