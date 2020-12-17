'use strict';

(function(){

var net = require('net'),
    iconv = require('iconv-lite'),
    AU = require('ansi_up');

    let lastPrompt = "";
    let last_line_type = "";
    let lastLine = "";
    let currentPrompt = "";

    let ansi = [
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

    let prompts = [
      "[Pause]",
      "[Pause] - [Press Space or Enter to continue]",
      "? ",
      "[32;1m[255D[255B[K",
      "Hotkey",
      "[255D[255B[K",
      " planet? ",
      "(Y/N)? ",
      "Enter the sector you wish to clear [",
      "[1;36mWhich sector do you want to avoid?",
      "(Y/N) [",
      "Y/N)",
      "Do you want to engage the [1;36mTransWarp [0;32",
      "How many fighters do you wish to use (",
      "[1;33mAre you sure you want to",
      "[1;36mEnter your choice:",
      "? ",
      "([1;33mL[0;35m)eave or ([1;33mT[0;35m)ake Colonists? [1;33m[L]",
      "([1;33m1[0;35m)Ore, ([1;33m2[0;35m)Org or ([1;33m3[0;35m)Equipment Production? ",
      "How many groups of Colonists do you want to leave ([1;36m",
      "Select ([1;33mH[0;35m)o"
    ];

    let GREEN = "[0;32m";   
    let END_OF_LINE = "[[END OF LINE]]";
    let ANSI_MARK = "";
    let CLEAR_LINE = "[255D[255B[K";
    let BACKSPACE = "\u0008";

    function isPrompt(line) {
      var isPrompt = false;

      if (line == undefined)         
        return "";


      //Handling the input prompts and backspaces
      console.log("outside length of one: ["+line.length+"]["+line+"]");
      if (((line.length == 1) || (currentPrompt == "[---------------------------------------]") && (line.length == 6)) || (line.indexOf(BACKSPACE) >= 0)) {
        console.log("inside length of one: ["+line+"]");
        if ((line == "\b") || (line.indexOf(BACKSPACE) >= 0)) {
          if (currentPrompt == "[---------------------------------------]") {
            lastPrompt = lastPrompt.slice(0, -6);
          }
          else {
              lastPrompt = lastPrompt.slice(0, -1);
          } 
          line = lastPrompt;
        }
        else {
          line = lastPrompt + line;
        }
        lastPrompt = line;
      }

      //Planet creation prompt
      if (line.indexOf("[---------------------------------------]") >= 0) {
        currentPrompt = "[---------------------------------------]";
        lastPrompt = line;
        isPrompt = true;
      }

      //General prompts (Command, Citadel, Corporate, Stardock, etc)
      if (((line.indexOf("[1;33m") >= 0) && (line.toLowerCase().indexOf("?=help") >= 0))) {
        var words = lastPrompt.split(" ");
        currentPrompt = words[0].trim();
        isPrompt = true;
        lastPrompt = line;
      }
    
      if (isPrompt) {
        lastPrompt = line;
        line = lastPrompt;
        return line;
      }

      for(var i=0; i<prompts.length; i++) {
        if (checkForPrompt(line,prompts[i])) {
          lastPrompt = line;
          return line;
        }
      }
      return "";
    }

    function checkForPrompt(line, search) {
      if (line.indexOf(ANSI_MARK) >= 0) {
        //No end of line check needed if we have ansi in the string
        if(line.indexOf(search) >= 0) {
          return true;
        }  
      } else {
        //If just plain string, we need to verify the end of the line
        if ((line+END_OF_LINE).indexOf((search+END_OF_LINE)) >= 0) {
          return true;
        }    
      }
      return false;
    }


  // string to uint array
function unicodeStringToTypedArray(s) {
    var escstr = encodeURIComponent(s);
    var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });
    var ua = new Uint8Array(binstr.length);
    Array.prototype.forEach.call(binstr, function (ch, i) {
        ua[i] = ch.charCodeAt(0);
    });
    return ua;
}

// uint array to string
function typedArrayToUnicodeString(ua) {
    var binstr = Array.prototype.map.call(ua, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    var escstr = binstr.replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(p).toString(16).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    });
    return decodeURIComponent(escstr);
}

function WebTelnetProxy(io, port, host) {
  if(this && (this instanceof WebTelnetProxy)) {
    this.reset();
    if(io) this.bind(io, port, host);
  } else {
    return new WebTelnetProxy(io, port, host);
  }
}

function binayUtf8ToString(buf, begin) {
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

WebTelnetProxy.prototype = {
  reset: function() {
    this.io = null;
    this.logTraffic = false;

    this.isRunning = false;
    this.timer = 0;
    this.lastTick = 0;

    this.sockets = {};  // sid -> socket
    this.socketsCount = 0;
    
    this.port = 23;
    this.host = '127.0.0.1';
    this.charset = '';
    return this;
  },

  showTraffic: function(y) {
    this.logTraffic = y;
    return this;
  },

  setCharset: function(cs) {
    this.charset = cs;
    return this;
  },

  bind: function(io, port, host) {
    if(this.isRunning) throw new Error('WebTelnetProxy is already running.');

    var proxy = this;
    proxy.io = io;
    proxy.port = port;
    proxy.host = host;

    io.on('connection', function(sock){
      proxy.onConnected(sock);
    });

    proxy.lastTick = Date.now();
    proxy.isRunning = true;

    // init tick() timer
    proxy.tick();
    proxy.timer = setInterval(function(){
      proxy.tick();
    }, 1000);
    
    return this;
  },

  shutdown: function() {
    if(!this.isRunning) return;

    // clear tick() timer
    if(this.timer) clearInterval(this.timer);

    this.reset();

    return this;
  },

  tick: function() {
    var server = this;
    server.lastTick = Date.now();
  },

  onDisconnected: function(webSock) {
    var proxy = this;
    var peerSock = webSock.peerSock;
    if(peerSock) {
      webSock.peerSock = null;
      peerSock.peerSock = null;
      peerSock.end();
    }
    delete proxy.sockets[ webSock.id ];
    proxy.socketsCount --;
  },

  connectTelnet: function(webSock) {
    var proxy = this;
    const fs = require('fs');
    var stream = fs.createWriteStream("www/history.html", {flags:'a'});

    var telnet = net.connect( proxy.port, proxy.host, function() {
      if(proxy.logTraffic) console.log('telnet connected');
      //webSock.emit('status', 'Telnet connected.\n');
    });

    telnet.peerSock = webSock;
    webSock.peerSock = telnet;

    telnet.on('data', function(buf) {
      //console.log('telnet: ', buf.toString());
      var peerSock = telnet.peerSock;
      if(peerSock) {
        
         
        if(proxy.charset && (proxy.charset !== 'utf8')) {
          buf = iconv.decode(buf, proxy.charset);
          buf = unicodeStringToTypedArray(buf);
        }
        var arrBuf = new ArrayBuffer(buf.length);
        var view = new Uint8Array(arrBuf);
        for(var i=0; i<buf.length; ++i) {
          view[i] = buf[i];
        }
        var gameData = binayUtf8ToString(new Uint8Array(buf), 0);
        
        for(var i=0; i<ansi.length; i++) {
          if (gameData.indexOf(ansi[i]) >= 0) {
            gameData = gameData.replace(new RegExp(ansi[i], "g"),"█");
          }
        }
        
       //Splitting subspace messages from prompt
        gameData = gameData.replace(new RegExp("\\[K\\[1A", "g"),"\n[K[1A");
        //console.log("["+ gameData + "]");
        if (lastLine != undefined) {
          //console.log("[[" + lastLine + "]]");
          gameData = (lastLine + gameData);
        }
        var lines = gameData.split('\n');
        if (lines.length > 1) {
          var lastLine_check = lines.pop();
          var promptLine = (isPrompt(lastLine_check));
          if (promptLine != "") {
            lines.push(promptLine);
            lastLine = "";
          }
          else{
            lastLine = lastLine_check;
          }  
        }
      
        var output = "";
        for(var i=0; i<lines.length; i++) {
          let line = lines[i];
          //console.log(i+"["+line+"]454545544545");
          let skip_this_line = false;

          //default class of tw-line
          var className = "tw-line";
         
          //If blank, mark it as a blank line - line height slightly smaller in view
          if ((line == undefined) || (line.trim() == "")) {
            if ((last_line_type == "blank-line") || (last_line_type == "tw-prompt") || (last_line_type == "tw-comms")) {
              skip_this_line = true;
            } 
            else {
              className = "blank-line";
            }
          }
          else {
            if (line.indexOf("[K[1A") >= 0) {
              className = "tw-comms";
            }
            else {
              if (isPrompt(line) != "") {
                if (i == (lines.length-1)) {
                  className = "tw-prompt";
                  line = lastPrompt;
                } else {
                  skip_this_line = true;
                }
              } else {
                if (line.trim().length == 1) {
                  className = "input-line";
                }    
              }  
            }
          }
          if (line.indexOf(" ") >= 0) {
            skip_this_line = true;
          }
          //The main heavy lifting of creating the HTML from the ansi received from the server
          if (!skip_this_line){
            var ansi_up = new AU.default;        
            line = ansi_up.ansi_to_html(line);
            last_line_type = className;
            output += "<div class='"+className+"'>" + line + "</div>";
          }
        }
        peerSock.emit('stream', output);
        stream.write(output);
      }
    });
    telnet.on('error', function(){
    });
    telnet.on('close', function(){
      if(proxy.logTraffic) console.log('telnet disconnected');
      stream.end();
      webSock.emit('status', 'Telnet disconnected.\n');
    });
    telnet.on('end', function(){
      var peerSock = telnet.peerSock;
      stream.end();
      if(peerSock) {
        peerSock.peerSock = null;
        telnet.peerSock = null;
      }
    });
  },

  onConnected: function(webSock) {
    var proxy = this;

    if(proxy.logTraffic) console.log('proxy client connected, socket id: ' + webSock.id);
    webSock.on('stream', function(message) {
      if(proxy.charset && (proxy.charset !== 'utf8')) {
        message = iconv.encode(message, proxy.charset);
      }
      //console.log('websocket: ', message);
      var peerSock = webSock.peerSock;
      if(peerSock) {
        peerSock.write(message);
      } else {
        proxy.connectTelnet(webSock);
      }
    });

    webSock.on('disconnect', function(){
      if(proxy.logTraffic) console.log('proxy client disconnected, socket id: ' + webSock.id);
      proxy.onDisconnected(webSock);
    });

    proxy.sockets[webSock.id] = webSock;
    proxy.socketsCount ++;
  },
};

exports = module.exports = WebTelnetProxy;

})();
