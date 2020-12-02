class TWLine {
    static GREEN = "[0;32m";   
    static END_OF_LINE = this.END_OF_LINE;
    static ANSI_MARK = "";
    static CLEAR_LINE = "[255D[255B[K";

    //Add prompts here as they are found not to be displaying
    static prompts = [
      "[Pause]",
      "[Pause] - [Press Space or Enter to continue]",
      "[32;1m[255D[255B[K",
      "Hotkey",
      "[255D[255B[K",
      "([1;33mL[0;35m)eave or ([1;33mT[0;35m)ake Colonists? [1;33m[L]",
      "([1;33m1[0;35m)Ore, ([1;33m2[0;35m)Org or ([1;33m3[0;35m)Equipment Production? ",
      "How many groups of Colonists do you want to leave ([1;36m",
      "<Load/Unload Colonists>",
      "Select ([1;33mH[0;35m)o",
      "Display planet? ",
      "[1;5;31m<Quit>",
      "Confirmed? (Y/N)? ",
      "Enter the sector you wish to clear [",
      "[1;36mWhich sector do you want to avoid?",
      "Do you wish to clear some avoids? (Y/N) [[1;33m",
      "Do you wish to clear ALL avoids? (Y/N) [",
      "Do you want to engage the [1;36mTransWarp [0;32",
      "How many fighters do you wish to use (",
      "Engage the Autopilot? ",
      "[1;33mAre you sure you want to",
      "Option? [1;33m(",
      "[1;36mEnter your choice:"
    ];

    static isPrompt(line) {
        console.log("["+line+"]");
        //special for main prompts
        if ((line.indexOf("[1;33m") >= 0) && (line.toLowerCase().indexOf("?=help") >= 0)) {
          window.lastPrompt = line;
          return true;
        }

        for(var i=0; i<this.prompts.length; i++) {
          if (this.checkForPrompt(line,this.prompts[i])) {
            window.lastPrompt = line;
            return true;
          }
        }
        //Not sure this is even doing anything at the moment
        /*
        if (((line+this.END_OF_LINE).indexOf(("[1;36mNo"+this.END_OF_LINE)) >= 0) || ((line+this.END_OF_LINE).indexOf(("[1;36mYes"+this.END_OF_LINE)) >= 0)) {
          //append Yes or No to last prompt
          //[1;36mYes
          window.lastPrompt = line;
          return true;
        }
        */
        return false;
    }

    static checkForPrompt(line, search) {
      if (line.indexOf(this.ANSI_MARK) >= 0) {
        //No end of line check needed if we have ansi in the string
        if(line.indexOf(search) >= 0) {
          return true;
        }  
      } else {
        //If just plain string, we need to verify the end of the line
        if ((line+this.END_OF_LINE).indexOf((search+this.END_OF_LINE)) >= 0) {
          return true;
        }    
      }
      return false;
    }

    static process(line) {
        line = line.replace(/\s\s/g, '&nbsp;&nbsp;');
        //line = line.replace(/\[+([^\][]+)]+/g,"<div>$1</div>");
        line = line.replace("[1;5;31m<Quit>","[1;5;31m[Quit]");
        line = line.replace("<Load/Unload Colonists>","[Load/Unload Colonists]");
        line = line.replace("[5;31;47mۛ[37;41mۛ[0m[5;31;47mۛ[37;41mۛ[0m","[0;32m-=-=");
        line = line.replace("[0;5;31;47mۛ[37;41mۛ[0m[5;31;47mۛ[37;41mۛ[0m","[0;32m=-=-");
        line = line.replace("[1;44m<Re-Display>","[1;44m[Re-Display]");
        
        //change things like this to regex - probably able to be done all over
        line = line.replace("[1;36m<Computer activated>","[1;36m[Computer activated]");
        line = line.replace("[1;36m<Computer deactivated>","[1;36m[Computer deactivated]");
        line = line.replace("[1;44m<Attack>","[1;44m[Attack]");
        line = line.replace("ĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄč","-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
        line = line.replace("ĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄĄ","-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
        if (line.indexOf("ɍ" > 0)) {    
            line = line.replace(/ɍ͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍ͻ/g, '------------------------------------------------------------');
            
            
            
            
            
            
            line = line.replace(/ȍ͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍͍ͼ/g, '------------------------------------------------------------');
    
    
    
    
    
            line = line.replace(/º/g, '|');
    
            line = line.replace(/ɍ͍͍͍͍͍͍͍͍͍͍͍͍͍»/g, '---------------------------');
    
            
            line = line.replace(/ȍ͍͍͍͍͍͍͍͍͍͍͍͍͍¼/g, '---------------------------');          


        }
        return line;    
    }
  }