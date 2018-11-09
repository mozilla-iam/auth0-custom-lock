module.exports = function trackPasswordManagerUsage() {
  var fireGAEvent = require( 'helpers/fire-ga-event' );
  var passwordField = document.getElementById( 'field-password' );
  var form = document.getElementById( 'nlx-form' );
  var start = 0;
  var end = 0;
  var time_spent_typing;

  passwordField.addEventListener( 'keypress', watchKeyTiming );
  form.addEventListener( 'submit', function() {
    if ( form.getAttribute( 'lock-state' ) === 'ldap' ) {
      report();
    }
  });

  function watchKeyTiming(event) {
    if ( start === 0 && event.target.value.length > 0 ) {
      start = Date.now();
    }
    if ( event.which !== 13 ) {
      end = Date.now();
    }
  }

  function report() {
    if ( start !== 0 ) {
      time_spent_typing = end - start;
    }
    else {
      time_spent_typing = 0;
    }

    if ( time_spent_typing < 200 ) {
      fireGAEvent( 'Password entry', 'Machine' );
    }
    else {
      fireGAEvent( 'Password entry', 'Human' );
    }

    start = 0;
    end = 0;
  }
};
