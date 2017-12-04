module.exports = function isLDAP( string ) {
  return /mozilla.com|mozilla.org|getpocket.com$/.test( string );
}
