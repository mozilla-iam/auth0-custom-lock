var ui = require( 'helpers/ui' );

module.exports = function checkIfMaintenanceMode( banner ) {
  var maintenanceMode = NLX.features.maintenanceMode;

  if ( maintenanceMode === 'true' ) {
    ui.show( banner );
  }
};
