class Connection {

  static ansi = [
    "ù",
    "þ",
    "Ã",
    "ü",
    "ý",
    "À",
    "Ù",
    "Ú",
    "¿",
    "³",
    "Ø",
    "¾",
    "Õ",
    "Å",
    "Ý",
    "ß",
    "Þ",
    "ú",
    "Ü",
    "Í",
    "Ä",
    "±",
    "°",
    "º",
    "É",
    "È",
    "¼",
    "»",
    "Û",
    "²"
  ];

    constructor() {
        // websocket
        window.last_line_type = "";
        this.sock = io.connect();
        this.sock.on('stream', function(buf){
            Connection.writeToScreen(buf);
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
          if ((flag >>>8) === 0 ) {
            str+= String.fromCharCode(buf[pos]);
            pos += 1;
      
          }
          else if ((flag &0xFC) === 0xFC ){
            unicode = (buf[pos] & 0x3) << 42;
            unicode |= (buf[pos+1] & 0x3F) << 36; 
            unicode |= (buf[pos+2] & 0x3F) << 30; 
            unicode |= (buf[pos+3] & 0x3F) << 24; 
            unicode |= (buf[pos+4] & 0x3F) << 18;
            unicode |= (buf[pos+5] & 0x3F) << 12;
            unicode |= (buf[pos+6] & 0x3F) << 6;
            unicode |= (buf[pos+6] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 8;
          }
          else if ((flag &0xFC) === 0xFC ){
            unicode = (buf[pos] & 0x3) << 36;
            unicode |= (buf[pos+1] & 0x3F) << 30; 
            unicode |= (buf[pos+2] & 0x3F) << 24; 
            unicode |= (buf[pos+3] & 0x3F) << 18; 
            unicode |= (buf[pos+4] & 0x3F) << 12;
            unicode |= (buf[pos+5] & 0x3F) << 6;
            unicode |= (buf[pos+6] & 0x3F);
            str+= String.fromCharCode(unicode) ;
            pos += 7;
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
          }
          else if ((flag &0xF8) === 0xF8 ){
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

    
    send(str) {
        if(this.sock) this.sock.emit('stream', str);
    }

    static writeToScreen(str) {
        var logLines = $(Viewscreen.GAME_LOG).find('div:visible').size();
        if (logLines > Viewscreen.maxLogLines) {
            $(Viewscreen.GAME_LOG).find('div:visible:lt(' + (Viewscreen.maxLogLines-80) + ')').addClass('backScroll').hide();
            //No value that I see for storing old prompt lines
            $(Viewscreen.VIEWSCREEN).scrollTop($(Viewscreen.GAME_LOG).prop("scrollHeight"));
        }
        $(Viewscreen.GAME_LOG).append(str);
        $(Viewscreen.VIEWSCREEN).scrollTop($(Viewscreen.VIEWSCREEN).prop("scrollHeight"));
        $(Viewscreen.GAME_LOG).find('div.tw-prompt:hidden').remove();
        $('.tw-line:visible').each(function(){ 
          if( $(this).text().trim() === '' )
              $(this).remove(); // if it is empty, it removes it
        });
}
}