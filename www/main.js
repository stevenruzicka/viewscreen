$(window).resize(adjustLayout);

let VIEWSCREEN = "div#viewscreen";
let UP = "\u001b[A";
let DOWN = "\u001b[B";
let RIGHT = "\u001b[C";
let LEFT = "\u001b[D";
let BACKSPACE = "\u0008";

$(function() {
  let connection = new Connection();

  // UI events 
  
  
  $(document).keypress(function(e) {
    e.preventDefault();
    var code = (e.keyCode ? e.keyCode : e.which);
    connection.send(String.fromCharCode(code));
    var el = $(VIEWSCREEN); 
   
  });

  $(window).keydown(function (e) {

    //https://www.novell.com/documentation/extend5/Docs/help/Composer/books/TelnetAppendixB.html

    var code = (e.keyCode ? e.keyCode : e.which);
    //up arrow
    if (code == 38) {
      e.preventDefault();
      $(VIEWSCREEN).focus();  
      connection.send(UP);
    }
    //down arrow
    if (code == 40) {
      e.preventDefault();
      $(VIEWSCREEN).focus();  
      connection.send(DOWN);
    }
    //left arrow
    if (code == 37) {
      e.preventDefault();
      $(VIEWSCREEN).focus();  
      connection.send(LEFT);
    }
    //right arrow
    if (code == 39) {
      e.preventDefault();
      $(VIEWSCREEN).focus();  
      connection.send(RIGHT);
    }
    //tab
    if (code == 9) {
      e.preventDefault();
      $(VIEWSCREEN).focus();  
      connection.send(String.fromCharCode(code));
    }
    //backspace
    if (code == 8) {
      e.preventDefault();
      //connection.send(BACKSPACE);
      connection.send("\b");
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
        //var html = $("body").html();
        //gameLog.document.body.insertAdjacentHTML('beforeend', html);
        //$(gameLog.document.body).find(Viewscreen.BACKSCROLL).show();
        $(gameLog.document.body).find(VIEWSCREEN).scrollTop(Number.MAX_SAFE_INTEGER);
        //$(gameLog.document.body).find(Viewscreen.VIEWSCREEN).trigger("click");
      };

      //connection.send(String.fromCharCode(code));
    }
  });

  setTimeout(function(){
    adjustLayout();
    connection.send('\n');
  },200)

});

function adjustLayout() {
  var w = $(window).width(),
      h = $(window).height();

  $(VIEWSCREEN).css({
    width: (w-2) + 'px',
    height: (h -2) + 'px',
  });
}