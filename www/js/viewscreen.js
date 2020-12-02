class Viewscreen {
    static VIEWSCREEN = "div#viewscreen";
    static GAME_LOG = this.VIEWSCREEN+" table.out";
    static maxLogLines = 300;

    static adjustLayout() {
        var w = $(window).width(),
            h = $(window).height();
      
        $(this.VIEWSCREEN).css({
          width: (w-2) + 'px',
          height: (h -2) + 'px',
        });
    }

}