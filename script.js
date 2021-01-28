const input = document.querySelector('.use-keyboard-input');




// var isSound = true;
// var btn = document.getElementsByClassName("sound_btn")[0];
// btn.style.backgroundImage = "url('assets/audio.png')";

// btn.addEventListener('click', function() {
//   isSound = !isSound;
//   if(isSound) btn.style.backgroundImage = "url('assets/audio.png')";
//   else btn.style.backgroundImage = "url('assets/mute.png')";
// });


const Keyboard = {
  keyLayoutEng: [
    "`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]","\\",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter",
    "shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
    "done","voice", "language", "space", "sound", "left", "right"
  ],
  keyShiftEng: [
    "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "backspace",
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "p", "{", "}", "|",
    "caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "enter",
    "shift", "Z", "X", "C", "V", "B", "N", "M", "<", ">", "/",
    "done", "voice", "language", "space", "sound", "left", "right"
  ],
  keyLayoutRus:[
    "ё", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ", "\\",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".",
    "done", "voice", "language", "space", "sound", "left", "right"
  ],
  keyShiftRus: [
    "Ё", "!", "\"", "№", ";", "%", ":", "?", "*", "(", ")", "backspace",
    "Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ", "/",
    "caps", "Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э", "enter",
    "shift", "Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "\\", 
    "done","voice", "language", "space", "sound", "left", "right"
  ],
  keyCodes : [
    "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Backspace", 
   "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "IntlBackslash", 
  "CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter", 
  "ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash",   
   "done", "voice", "language", "Space", "sound", "ArrowLeft", "ArrowRight"
  ],
  insertLineBreakEng: ["backspace", "\\", "enter", "?"],
  insertLineBreakEngShift: ["backspace", "|", "enter", "/"],
  insertLineBreakRus: ["backspace", "\\", "enter", "."],
  insertLineBreakRusShift: ["backspace", "/", "enter", "\\"],

  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false,
    shift: false,
    language: true,
    curentCursor: 0,
    soundOn: false,
    record: false,
    start: 0,
    end: 0,
    direction: 'none'
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
      element.addEventListener("focus", () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });
      element.addEventListener('click', () => {
        this.properties.direction = 'none';
        this.properties.start = input.selectionStart;
        this.properties.end = input.selectionEnd;
      });
      // element.addEventListener("click", () => {
      //   element.selectionStart = this.properties.curentCursor;
      //   element.selectionEnd = this.properties.curentCursor;
      // });
      element.addEventListener("keypress", key => {
       
       
        this.properties.value+=key.key;
        this.open(element.value, currentValue => {
          if (this.properties.start > element.value.length) {
            element.value += currentValue.substring(currentValue.length - 1, currentValue.length);
          }
          else {
            element.value = element.value.substring(0, this.properties.start-1)
              + currentValue.substring(this.properties.start-1, this.properties.end) 
                + element.value.substring(this.properties.end-1, element.value.length);
          }
        });
        this.properties.start++;
        this.properties.end++;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();

    let keysMain = this.keyLayoutEng;
    let insertLineBreakMain = this.insertLineBreakEng;

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keysMain.forEach((key, index) => {
      const keyElement = document.createElement("button");
      const insertLineBreak = insertLineBreakMain.indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "sound":
            keyElement.classList.add("keyboard__key");
            keyElement.innerHTML = createIconHTML("volume_off");
            keyElement.value = this.keyCodes[index];
            keyElement.addEventListener("click", () => {
                if(this.properties.soundOn) SoundForKeys("OrdinaryEn");
                else SoundForKeys("OrdinaryRus");
                this.properties.soundOn = !this.properties.soundOn;
                if(this.properties.soundOn)  keyElement.innerHTML = createIconHTML("volume_up");
                else  keyElement.innerHTML = createIconHTML("volume_off");
                input.focus();
            });
  
            break;
        case "backspace":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");
          keyElement.value = this.keyCodes[index];
          keyElement.id = 'back';
          keyElement.addEventListener("click", () => {
            SoundForKeys("Backspace");
            input.focus();

            input.click();
            if (this.properties.start !== this.properties.end) {
              this.properties.value = this.properties.value.substring(0, this.properties.start)
                + this.properties.value.substring(this.properties.end, this.properties.value.length);
            }
            else 
              this.properties.value = this.properties.value.substring(0, this.properties.start-1) 
                + this.properties.value.substring(this.properties.end, this.properties.value.length);
            this._triggerEvent("oninput");
            input.focus();

            let range = this.properties.end - this.properties.start;
            if (range > 0) {
              this.properties.end -= range;
            }
            else {
              this.properties.start--;
              this.properties.end--;
            }

            if (this.properties.start < 0) this.properties.start = 0;
            if (this.properties.end < 0) this.properties.end = 0;

            input.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;

        case "caps":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");
          keyElement.value = this.keyCodes[index];
          keyElement.id = "caps";

          keyElement.addEventListener("click", () => {
            SoundForKeys("CapsLock");
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
          });

          break;

        case "shift":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.textContent = "Shift";
          keyElement.innerHTML = createIconHTML("north");
          keyElement.value = this.keyCodes[index];
          keyElement.id = "shift";

          keyElement.addEventListener("click", () => {
            SoundForKeys("ShiftLeft");
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            
          });

          break;

        case "enter":
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");
          keyElement.value = this.keyCodes[index];
          keyElement.id = "enter";

          keyElement.addEventListener("click", () => {
            SoundForKeys("Enter");

               this.properties.value = this.properties.value.substring(0, this.properties.start) 
               + "\n" 
                 + this.properties.value.substring(this.properties.end, this.properties.value.length);
 
             let range = this.properties.end - this.properties.start;
             if (range > 0) {
               this.properties.end -= range;
             }
 
             this.properties.start++;
             this.properties.end++;
             this._triggerEvent("oninput");
             input.focus();
             input.setSelectionRange(this.properties.start, this.properties.end);

          });

          break;

        case "space":
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");
          keyElement.value = this.keyCodes[index];
          keyElement.id = "space";

          keyElement.addEventListener("click", () => {
            if(this.properties.language) SoundForKeys("OrdinaryEn");
            else SoundForKeys("OrdinaryRus");

             this.properties.value = this.properties.value.substring(0, this.properties.start) 
             + ' ' 
               + this.properties.value.substring(this.properties.end, this.properties.value.length);
           this.properties.start++;
           this.properties.end++;
           this._triggerEvent("oninput");
           input.focus();

           let range = this.properties.end - this.properties.start;
           input.setSelectionRange(this.properties.end-range, this.properties.end-range);
           if (range>0) {
             this.properties.end -= range;
           }
          });

          break;

        case "done":
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");
          keyElement.value = this.keyCodes[index];

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case "voice":
            keyElement.innerHTML = createIconHTML("keyboard_voice");
            keyElement.classList.add("mic");
            //запись звука
            keyElement.addEventListener('click', () => {
              if (this.properties.language) rec.lang = "en-US";
              else rec.lang = "ru-RU";
  
              this.properties.record = !this.properties.record;

              if (this.properties.record) { 
                rec.addEventListener("result", speech);
                rec.start();
              }
              else {
                rec.removeEventListener("result", speech);
                rec.stop();
              }
              keyElement.classList.toggle("keyboard__key--voice", this.properties.record);
              input.focus();
            });
            break;

        case "language":
          if(this.properties.language) keyElement.textContent = "en";
          else keyElement.textContent = "ru";
          keyElement.value = this.keyCodes[index];

          keyElement.addEventListener("click", () => {
            if(this.properties.language) SoundForKeys("OrdinaryEn");
            else SoundForKeys("OrdinaryRus");
            this.properties.language = !this.properties.language;
            this._toggleLanguage();
          });

        break;

        case "left":
            keyElement.textContent = key;
            keyElement.innerHTML = createIconHTML("keyboard_arrow_"+key);
            keyElement.value = this.keyCodes[index];
            keyElement.id = "left";
            keyElement.addEventListener("click", () => {
                if(this.properties.language) SoundForKeys("OrdinaryEn");
                else SoundForKeys("OrdinaryRus");
              this.setCaretPosition("myTextArea", -1);
              this.properties.direction = 'none';
              this.properties.start--;
              this.properties.end--;

              if (this.properties.start < 0) this.properties.start = 0;
              if (this.properties.end < 0) this.properties.end = 0;
              this.properties.start = this.properties.end;
              input.setSelectionRange(this.properties.start, this.properties.end);
            });
  
            break;

        case "right":
              keyElement.textContent = key;
              keyElement.innerHTML = createIconHTML("keyboard_arrow_"+key);
              keyElement.value = this.keyCodes[index];
              keyElement.id = "right";
              keyElement.addEventListener("click", () => {
                if(this.properties.language) SoundForKeys("OrdinaryEn");
                else SoundForKeys("OrdinaryRus");
                this.setCaretPosition("myTextArea", 1);
                this.properties.direction = 'none';
                this.properties.start++;
                this.properties.end++;

                if (this.properties.start > this.properties.value.length) this.properties.start = this.properties.value.length;
                if (this.properties.end > this.properties.value.length) this.properties.end = this.properties.value.length;
                this.properties.start = this.properties.end;
                input.setSelectionRange(this.properties.start, this.properties.end);
              });
    
            break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.value = this.keyCodes[index];

          keyElement.addEventListener("click", () => {
            if(this.properties.language) SoundForKeys("OrdinaryEn");
                else SoundForKeys("OrdinaryRus");

            let symbol = keyElement.textContent;
            if (this.properties.capsLock || this.properties.shift) symbol=symbol.toUpperCase(); 
            else symbol=symbol.toLowerCase(); 
            if (this.properties.capsLock && this.properties.shift) symbol=symbol.toLowerCase();

             this.properties.value = this.properties.value.substring(0, this.properties.start) 
             + symbol
               + this.properties.value.substring(this.properties.end, this.properties.value.length);

           let range = this.properties.end - this.properties.start;
           if (range > 0) {
             this.properties.end-=range;
           }
           this.properties.start++;
           this.properties.end++;

          this._triggerEvent("oninput");

           input.focus();

           input.setSelectionRange(this.properties.start, this.properties.end);
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },
  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this._changeSymbols();
  },
  _toggleShift(){
    this.properties.shift = !this.properties.shift;
    this._changeSymbols();
  },
  _toggleLanguage(){
    this._changeSymbols();
  },

  _changeSymbols(){
    var keysMain = this.keyLayoutEng;
    if(this.properties.shift && this.properties.language) {
      keysMain = this.keyShiftEng;
    }
    if(this.properties.shift && !this.properties.language) {
      keysMain = this.keyShiftRus;
    }
    if(!this.properties.shift && !this.properties.language) {
      keysMain = this.keyLayoutRus;
    }
    let i = 0;
    for (const key of this.elements.keys) {
      if (keysMain[i]!="backspace"
        && keysMain[i]!="space"
        && keysMain[i]!="enter"
        && keysMain[i]!="done"
        && keysMain[i]!="caps"
        && keysMain[i]!="language"
        && keysMain[i]!="left" &&  keysMain[i]!="right"
        && keysMain[i]!="voice"
        && keysMain[i]!="sound") {
        key.textContent = keysMain[i];
        if(keysMain[i]!="shift" && keysMain[i]!="caps" && key.childElementCount === 0 && this.properties.shift && this.properties.capsLock){
          key.textContent = key.textContent.toLowerCase();
        }
        if(keysMain[i]!="shift" && keysMain[i]!="caps" && key.childElementCount === 0 && !this.properties.shift && this.properties.capsLock){
          key.textContent = key.textContent.toUpperCase();
        }
        if(keysMain[i]!="shift" && keysMain[i]!="caps" && key.childElementCount === 0 && this.properties.shift && !this.properties.capsLock){
          key.textContent = key.textContent.toUpperCase();
        }
        if(keysMain[i]!="shift" && keysMain[i]!="caps" && key.childElementCount === 0 && !this.properties.shift && !this.properties.capsLock){
          key.textContent = key.textContent.toLowerCase();
        }
      }
      if(keysMain[i]=="language" && this.properties.language){
        key.textContent = "en";
      } else if(keysMain[i]=="language") key.textContent = "ru";
      // this._triggerEvent("oninput");
      i++;
    }    
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  },

  setCaretPosition(elemId, caretPos) {
    var elem = document.getElementById(elemId);
    elem.focus();
  
    var position = elem.selectionStart;
  
    if(elem != null) {
      elem.selectionStart = position+caretPos;
      elem.selectionEnd = position+caretPos;
      this.properties.curentCursor = position+caretPos;
    }
  }
};

window.addEventListener("DOMContentLoaded", function () {
  Keyboard.init();
}); 

String.prototype.splice = function(start, delCount, newSubStr) {
  return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

 let lastKeys = []

document.onkeydown = function(e){
  for(let i=0; i<lastKeys.length; i++) {
    if(lastKeys[i] == "caps"){
      let key = document.getElementById("caps");
    //   key.classList.remove("keyboard__key--lighting");
    }
    else if(lastKeys[i] == "shift" && lastKeys.length > 1){
      Keyboard._toggleShift();
      let key = document.getElementById("shift");
    //   key.classList.remove("keyboard__key--lighting");
    } else {
        for (const key of Keyboard.elements.keys) {
            if(key.textContent === lastKeys[i]){
            //   key.classList.remove("keyboard__key--lighting");
          }
        }
      }
  }
  lastKeys = [];
  if(e.keyCode == 8){
    //back
    let key = document.getElementById("back");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
  }
  if(e.keyCode == 20){
    //caps
   Keyboard._toggleCapsLock();
    let key = document.getElementById("caps");
    key.classList.toggle("keyboard__key--active", Keyboard.properties.capsLock);
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push("caps");
  }
  if(e.keyCode == 16){
    //shift
    Keyboard._toggleShift();
    let key = document.getElementById("shift");
    key.classList.toggle("keyboard__key--active", Keyboard.properties.shift);
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push("shift");
  }
  if(e.keyCode == 188){
    //<
    let key = document.getElementById("left");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
    Keyboard.properties.curentCursor = document.getElementById("myTextArea").selectionStart-1;
  }
  if(e.keyCode == 190){
    //>
    let key = document.getElementById("right");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
    Keyboard.properties.curentCursor = document.getElementById("myTextArea").selectionStart+1;
  }
  if(e.keyCode == 37){
    //<
    let key = document.getElementById("left");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
    Keyboard.properties.curentCursor = document.getElementById("myTextArea").selectionStart-1;
  }
  if(e.keyCode == 39){
    //>
    let key = document.getElementById("right");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
    Keyboard.properties.curentCursor = document.getElementById("myTextArea").selectionStart+1;
  }
}

function pressKey(e){
  for(let i=0; i<lastKeys.length; i++) {
    if(lastKeys[i] == "shift" && lastKeys.length > 1){
      Keyboard._toggleShift();
      let key = document.getElementById("shift");
    //   key.classList.remove("keyboard__key--lighting");
    } else {
        for (const key of Keyboard.elements.keys) {
            if(key.textContent === lastKeys[i]){
            //   key.classList.remove("keyboard__key--lighting");
          }
        }
     }
  }
  lastKeys = [];
  if(e.charCode == 13){
    //enter
    let key = document.getElementById("enter");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
  }
  if(e.keyCode == 8){
    //enter
    let key = document.getElementById("back");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
  }
  else if(e.charCode == 32){
    //space
    let key = document.getElementById("space");
    // key.classList.add("keyboard__key--lighting");
    lastKeys.push(key.textContent);
  }
  else {
    var res = String.fromCharCode(e.charCode);
    for (const key of Keyboard.elements.keys) {
      if(key.textContent === res){
        // key.classList.add("keyboard__key--lighting");
        lastKeys.push(key.textContent);
        Keyboard.properties.value = Keyboard.properties.value.toString().splice(Keyboard.properties.curentCursor, 0, key.textContent);
        Keyboard.properties.curentCursor = document.getElementById("myTextArea").selectionStart;
      }
    }
  }
}



function SoundForKeys(button){
    if(Keyboard.properties.soundOn){
        const audio = document.querySelector(`audio[value="${button}"]`);
        audio.currentTime = 0;
        audio.play();
    }
}

document.addEventListener("keydown", function(e) {
    const key = document.querySelector(`.keyboard__key[value="${e.code}"]`);
      key.classList.add("playing");
    setTimeout(() => {
      key.classList.remove("playing");
  }, 200);

  });


document.addEventListener("keydown", function(e) {
    if(Keyboard.properties.soundOn){
    const key = document.querySelector(`.keyboard__key[value="${e.code}"]`);
    if (e.code !== "Enter" && e.code !== "Backspace" && e.code !== "CapsLock" &&  e.code !== "ShiftLeft") {
        let audioOrdinary;
        if (Keyboard.properties.language) {
            audioOrdinary = document.querySelector(`audio[value="OrdinaryRus"]`);
        }  
        else {
            audioOrdinary = document.querySelector(`audio[value="OrdinaryEn"]`);  
        }
        if (!audioOrdinary) return;
            audioOrdinary.currentTime = 0;
            audioOrdinary.play();
            key.classList.add("playing");          
    } else {
      const audioExclusive = document.querySelector(`audio[value="${e.code}"]`);
      if (!audioExclusive) return;
      audioExclusive.currentTime = 0;
      audioExclusive.play();
      key.classList.add("playing");
    }
    setTimeout(() => {
      key.classList.remove("playing");
  }, 200);
}
  });

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const rec = new SpeechRecognition();
rec.interimResults = true;
rec.continuous = true;

function speech (event) {
  const text = Array.from(event.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');
  input.value = text;
}