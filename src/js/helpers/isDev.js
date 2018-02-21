module.exports = function() {
  var host = window.location.host.toString();

  return /^auth-dev/.test( host ) ? true : false;
};
