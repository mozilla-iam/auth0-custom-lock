module.exports = function setAutologinPreference( element ) {
  var checkbox = element;

  // when page loads, make sure checkbox matches autologin setting
  // (one of these two is not needed, depending on whether page has
  // 'checked' attribute on the checkbox)
  if ( localStorage.getItem( 'nlx-last-used-connection' ) !== null ) {
    checkbox.checked = true;
  }

  if ( localStorage.getItem( 'nlx-prevent-autologin' ) !== null ) {
    checkbox.checked = false;
  }


  checkbox.addEventListener( 'change', function() {
    // when autologin is turned OFF, remove last used connection,
    // prevent autologin method from being stored next time
    if ( checkbox.checked === false ) {
      localStorage.removeItem( 'nlx-last-used-connection' );
      localStorage.setItem( 'nlx-prevent-autologin', 'true' );
    }
    // when autologin is tuned ON, no longer prevent autologin
    // method from being set
    else {
      localStorage.removeItem( 'nlx-prevent-autologin' );
    }
  });
};
