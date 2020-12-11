class TWLine {
    static GREEN = "[0;32m";   
    static END_OF_LINE = "[[END OF LINE]]";
    static ANSI_MARK = "";
    static CLEAR_LINE = "[255D[255B[K";

    //Add prompts here as they are found not to be displaying
    static prompts = [
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

    static isPrompt(line) {
      var isPrompt = false;
      if ((line+TWLine.END_OF_LINE).indexOf("[---------------------------------------]") >= 0) {
        //remove last prompt for name planets for visual
        console.log("planet prompt");
        window.lastPrompt = line;
        isPrompt = true;
      }
      if (line == undefined) {
        return "";
      }
      if (line.trim() == "") {
        return line;
      }
      if ((line.trim().length <= 7) && (window.lastPrompt != "")) {
        //For user input like sector numbers
        line = window.lastPrompt + line;
      }
      if (((line.indexOf("[1;33m") >= 0) && (line.toLowerCase().indexOf("?=help") >= 0)) || (isPrompt == true)) {
        window.lastPrompt = line;
        return line;
      }

      for(var i=0; i<this.prompts.length; i++) {
        if (this.checkForPrompt(line,this.prompts[i])) {
          window.lastPrompt = line;
          return line;
        }
      }
      return "";
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

  }