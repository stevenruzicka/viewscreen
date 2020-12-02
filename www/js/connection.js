class Connection {
    constructor() {
        // websocket
        this.sock = io.connect();
        this.sock.on('stream', function(buf){
            Connection.writeServerData(buf);
        });
        this.sock.on('status', function(str){
            Connection.writeToScreen(str);
        });
    }

    static binayUtf8ToString(buf, begin){
        var i = 0;
        var pos = 0;
        var str ="";
        var unicode = 0 ;
        var flag = 0;
        for (pos = begin; pos < buf.length;){
          flag= buf[pos];
          if ((flag >>>7) === 0 ) {
            str+= String.fromCharCode(buf[pos]);
            pos += 1;
      
          }
          else if ((flag &0xFC) === 0xFC ){
            unicode = (buf[pos] & 0x3) << 30;
            unicode |= (buf[pos+1] & 0x3F) << 24; 
            unicode |= (buf[pos+2] & 0x3F) << 18; 
            unicode |= (buf[pos+3] & 0x3F) << 12; 
            unicode |= (buf[pos+4] & 0x3F) << 6;
            unicode |= (buf[pos+5] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 6;
      
          }else if ((flag &0xF8) === 0xF8 ){
            unicode = (buf[pos] & 0x7) << 24;
            unicode |= (buf[pos+1] & 0x3F) << 18; 
            unicode |= (buf[pos+2] & 0x3F) << 12; 
            unicode |= (buf[pos+3] & 0x3F) << 6;
            unicode |= (buf[pos+4] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 5;
      
          }
          else if ((flag &0xF0) === 0xF0 ){
            unicode = (buf[pos] & 0xF) << 18;
            unicode |= (buf[pos+1] & 0x3F) << 12; 
            unicode |= (buf[pos+2] & 0x3F) << 6;
            unicode |= (buf[pos+3] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 4;
      
          }
      
          else if ((flag &0xE0) === 0xE0 ){
            unicode = (buf[pos] & 0x1F) << 12;;
            unicode |= (buf[pos+1] & 0x3F) << 6;
            unicode |= (buf[pos+2] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 3;
      
          }
          else if ((flag &0xC0) === 0xC0 ){ //110
            unicode = (buf[pos] & 0x3F) << 6;
            unicode |= (buf[pos+1] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 2;
      
          }
          else{
            str+= String.fromCharCode(buf[pos]);
            pos += 1;
          }
       } 
       return str;
    }

    static writeServerData(buf) {
        var data = new Uint8Array(buf);
        var str = Connection.binayUtf8ToString(data, 0);
      
        var lines = str.split('\n');
        
        if (window.lastLine != undefined) {
          lines[0] = window.lastLine + lines[0];    
        }
        var lastLine = lines.pop();
        if (TWLine.isPrompt(lastLine)) {
          lines.push(lastLine);
          window.lastLine = "";
        }
        else{
          window.lastLine = lastLine;
        }
      
        for(var i=0; i<lines.length; i++) {
          let line = TWLine.process(lines[i]);
          //default class of tw-line
          var className = "tw-line";
          if (TWLine.isPrompt(line)) {
            className = "tw-prompt";
      
            //When ansi is clearing the line, place the last known prompt down
            if((line+TWLine.END_OF_LINE).indexOf((TWLine.CLEAR_LINE+TWLine.END_OF_LINE)) >= 0) {
              line = window.lastPrompt;
            }
          }
      
          //The main heavy lifting of creating the HTML from the ansi received from the server
          line = ansi_up.ansi_to_html(line);
          
          //If blank, mark it as a blank line - line height slightly smaller in view
          if (line.trim() == "") {
            className = "blank-line";
          }
      
          //If line only has one character, assume it's input from the user.  Curremtly hiding that.
          if (line.trim().length == 1) {
            className = "input-line";
          }
          this.writeToScreen("<tr class='"+className+"'><td>" + line + "</td></tr>");
        }
    }      
    
    send(str) {
        if(this.sock) this.sock.emit('stream', str);
    }

    static writeToScreen(str) {
        var logLines = $(Viewscreen.GAME_LOG).find('tr:visible').size();
        if (logLines > Viewscreen.maxLogLines) {
            $(Viewscreen.GAME_LOG).find('tr:visible:lt(' + (maxLogLines-80) + ')').addClass('backScroll').hide();
            //No value that I see for storing old prompt lines
            $(Viewscreen.GAME_LOG).find('tr.twprompt:hidden').remove();
            $(Viewscreen.VIEWSCREEN).scrollTop(out.prop("scrollHeight"));
        }
        $(Viewscreen.GAME_LOG).append(str);
        $(Viewscreen.VIEWSCREEN).scrollTop($(Viewscreen.VIEWSCREEN).prop("scrollHeight"));
    }

    static ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint16Array(buf));
    }
}