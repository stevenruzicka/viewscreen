$(window).resize(Viewscreen.adjustLayout);

$(function() {
  
  $(window).keydown(function (e) {

    //https://www.novell.com/documentation/extend5/Docs/help/Composer/books/TelnetAppendixB.html

    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 27) {
      e.preventDefault();
      window.close();
    }
  });

  setTimeout(function(){
    Viewscreen.adjustLayout();
    connection.send('\n');
  },200)
});
