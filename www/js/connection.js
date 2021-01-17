class Connection {
  
    constructor() {
  
        // websocket
        window.last_line_type = "";
        this.sock = io.connect();
        let parent = this;
        this.sock.on('stream', function(buf){
          parent.writeToScreen(buf);
        });
        this.sock.on('status', function(str){
          parent.writeToScreen(str);
        });
    }

    send(str) {
        if(this.sock) this.sock.emit('stream', str);
    }

    writeToScreen(str) {
      let VIEWSCREEN = "div#viewscreen";
      let GAME_LOG = VIEWSCREEN+" .out";
      let BACKSCROLL = ".backScroll";
      let maxLogLines = 150;
  
      let logLines = $(GAME_LOG).find('div:visible').size();
      if (logLines > maxLogLines) {
            $(GAME_LOG).find('div:visible:lt(' + (maxLogLines-80) + ')').addClass('backScroll').hide();
            //No value that I see for storing old prompt lines
            $(VIEWSCREEN).scrollTop($(GAME_LOG).prop("scrollHeight"));
        }
        $(GAME_LOG).append(str);
        $(VIEWSCREEN).scrollTop($(VIEWSCREEN).prop("scrollHeight"));
        $(GAME_LOG).find('div.tw-prompt:hidden').remove();
        $('.tw-line:visible').each(function(){ 
          if( $(this).text().trim() === '' )
              $(this).remove(); // if it is empty, it removes it
        });
     }
}