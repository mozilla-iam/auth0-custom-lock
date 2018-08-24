var ui = require( 'helpers/ui' );

module.exports = function checkIfMaintenanceMode( banner ) {
  var maintenance_mode = NLX.features.maintenance_mode;

  if ( maintenance_mode === 'true' ) {
    ui.show( banner );
  }
};
