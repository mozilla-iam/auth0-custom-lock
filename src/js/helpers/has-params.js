module.exports = function hasParams( string ) {
  return window.location.href.indexOf( string ) >= 0;
};
