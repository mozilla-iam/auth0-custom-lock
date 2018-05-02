module.exports = function() {
  var url = new URL( window.location );
  var redirectURI;

  if ( url.searchParams.get( 'redirect_uri' ) ) {
    redirectURI = new URL( url.searchParams.get( 'redirect_uri' ) );

    return redirectURI.hostname;
  }
  else {
    return null;
  }
};
