module.exports = function( element ) {
  var KEY_ENTER = 13;
  var form = element.form;

  element.addEventListener( 'keyup', function( event ) {
    if ( event.which === KEY_ENTER && element.value.length > 0 ) {
      form.submit();
    }
  });
};
