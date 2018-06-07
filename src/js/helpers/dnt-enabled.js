module.exports = function( dnt, ua ) {

  // for old version of IE we need to use the msDoNotTrack property of navigator
  // on newer versions, and newer platforms, this is doNotTrack but, on the window object
  // Safari also exposes the property on the window object.
  var dntStatus = dnt || navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  var userAgent = ua || navigator.userAgent;

  // List of Windows versions known to not implement DNT according to the standard.
  var anomalousWinVersions = [ 'Windows NT 6.1', 'Windows NT 6.2', 'Windows NT 6.3' ];

  var fxMatch = userAgent.match( /Firefox\/(\d+)/ );
  var ieRegEx = /MSIE|Trident/i;
  var isIE = ieRegEx.test( userAgent );

  // Matches from Windows up to the first occurance of ; un-greedily
  // http://www.regexr.com/3c2el
  var platform = userAgent.match( /Windows.+?(?=;)/g );

  // With old versions of IE, DNT did not exist so we simply return false;
  if ( isIE && typeof Array.prototype.indexOf !== 'function' ) {
    return false;
  }
  else if ( fxMatch && parseInt( fxMatch[1], 10 ) < 32 ) {
    // Can't say for sure if it is 1 or 0, due to Fx bug 887703
    dntStatus = 'Unspecified';
  }
  else if ( isIE && platform && anomalousWinVersions.indexOf( platform.toString() ) !== -1 ) {
    // default is on, which does not honor the specification
    dntStatus = 'Unspecified';
  }
  else {
    // sets dntStatus to Disabled or Enabled based on the value returned by the browser.
    // If dntStatus is undefined, it will be set to Unspecified
    dntStatus = { 0: 'Disabled', 1: 'Enabled' }[ dntStatus ] || 'Unspecified';
  }

  return dntStatus === 'Enabled' ? true : false;
};
