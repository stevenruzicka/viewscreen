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

    //https://www.novell.com/documentation/extend5/Docs/help/Composer/books/TelnetAppendixB.html

    var code = (e.keyCode ? e.keyCode : e.which);
    //up arrow
    if (code == 38) {
      e.preventDefault();
      $(Viewscreen.VIEWSCREEN).focus();  
      connection.send("\u001b[A");
    }
    //down arrow
    if (code == 40) {
      e.preventDefault();
      $(Viewscreen.VIEWSCREEN).focus();  
      connection.send("\u001b[B");
    }
    //left arrow
    if (code == 37) {
      e.preventDefault();
      $(Viewscreen.VIEWSCREEN).focus();  
      connection.send("\u001b[D");
    }
    //right arrow
    if (code == 39) {
      e.preventDefault();
      $(Viewscreen.VIEWSCREEN).focus();  
      connection.send("\u001b[C");
    }
    //tab
    if (code == 9) {
      e.preventDefault();
      $(Viewscreen.VIEWSCREEN).focus();  
      connection.send(String.fromCharCode(code));
    }
    //backspace
    if (code == 8) {
      e.preventDefault();
      connection.send("\u0008");
    }
    if(code == 33) {
      e.preventDefault();
      let params = "status=0";
      let gameLog = window.open("game_log.html", "game-log", params); 
      if(gameLog) {
        gameLog.close();
        gameLog = window.open("game_log.html", "game-log", params); 
      } 
      gameLog.focus();
      gameLog.onload = function() {
        var html = $("body").html();
        gameLog.document.body.insertAdjacentHTML('beforeend', html);
        $(gameLog.document.body).find("tr.backScroll").show();
        $(gameLog.document.body).find(Viewscreen.VIEWSCREEN).scrollTop(Number.MAX_SAFE_INTEGER);
        $(gameLog.document.body).find(Viewscreen.VIEWSCREEN).focus();
      };

      //connection.send(String.fromCharCode(code));
    }
  });

  setTimeout(function(){
    Viewscreen.adjustLayout();
    connection.send('\n');
  },200)

});
