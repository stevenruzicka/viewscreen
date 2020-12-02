$(window).resize(Viewscreen.adjustLayout);

$(function() {
  let connection = new Connection();

  // UI events 
  
  $(document).keypress(function(e) {
    e.preventDefault();
    var code = (e.keyCode ? e.keyCode : e.which);
    connection.send(String.fromCharCode(code));
    var el = $(Viewscreen.VIEWSCREEN); 
   
  });

  $(window).keydown(function (e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    //tab
    if (code == 9) {
      e.preventDefault();
      $(Viewscreen.VIEWSCREEN).focus();  
      connection.send(String.fromCharCode(code));
    }
    //backspace
    if (code == 8) {
      e.preventDefault();
      connection.send(String.fromCharCode(code));
    }
  });

  setTimeout(function(){
    Viewscreen.adjustLayout();
    connection.send('\n');
  },200)

});
