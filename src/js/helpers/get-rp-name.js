function getUrlParameter( name ) {
  var regex;
  var results;

  name = name.replace( /[\[]/, '\\[' ).replace( /[\]]/, '\\]' );
  regex = new RegExp( '[\\?&]' + name + '=([^&#]*)' );
  results = regex.exec( location.search );

  return results === null ? '' : decodeURIComponent( results[1].replace( /\+/g, ' ' ) );
}

// via https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string
function extractHostname( url ) {
  var hostname;

  // find & remove protocol (http, ftp, etc.) and get hostname
  if ( url.indexOf( '://' ) > -1 ) {
    hostname = url.split( '/' )[2];
  }
  else {
    hostname = url.split( '/' )[0];
  }

  // find & remove port number
  hostname = hostname.split( ':' )[0];
  // find & remove "?"
  hostname = hostname.split( '?' )[0];

  return hostname;
}

module.exports = function() {
  var RP = getUrlParameter( 'redirect_uri' ) || '';

  return extractHostname( RP );
};
