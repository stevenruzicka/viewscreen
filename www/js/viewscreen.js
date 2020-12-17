class Viewscreen {
    static VIEWSCREEN = "div#viewscreen";
    static GAME_LOG = this.VIEWSCREEN+" .out";
    static BACKSCROLL = ".backScroll";
    
    static UP = "\u001b[A";
    static DOWN = "\u001b[B";
    static RIGHT = "\u001b[C";
    static LEFT = "\u001b[D";
    static BACKSPACE = "\u0008";

    static maxLogLines = 150;

    static adjustLayout() {
        var w = $(window).width(),
            h = $(window).height();
      
        $(this.VIEWSCREEN).css({
          width: (w-2) + 'px',
          height: (h -2) + 'px',
        });
    }

}