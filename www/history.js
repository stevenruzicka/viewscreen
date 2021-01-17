$(window).resize(adjustLayout);

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
    adjustLayout();
    connection.send('\n');
  },200)
});

function adjustLayout() {
  var w = $(window).width(),
      h = $(window).height();

  $("div#viewscreen").css({
    width: (w-2) + 'px',
    height: (h -2) + 'px',
  });
}

