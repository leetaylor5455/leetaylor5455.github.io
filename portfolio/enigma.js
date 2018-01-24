var r1Pos = parseInt($('#r1').val(), 10);
var r2Pos = parseInt($('#r2').val(), 10);
var r3Pos = parseInt($('#r3').val(), 10);


function rotor(wir, not) {

  this.wiring = wir || [];
  this.notchIndex = not || 0;

}

const get = {

  /**
   * @param {array<int>} searchIn must be ordered lowest to highest, must not contain duplicate values
   * @param {int} searchFor
   * @returns {boolean} whether the searchFor exists in the searchIn array
   */
  keyIndex: function(searchFor, searchIn = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
    // Iterates through all items in array
    for (var i = 0; i < 26; i++) {
      // If currently indexed item is the target
      if (searchIn[i] === searchFor) {
        // Found
        return i;
      }
    }
    // If it hasn't been found in the for loop it isn't existant in array
    return false;
  },

}


// Temp
const plugArr = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

//                YRUHQSLDPXNGOKMIEBFZCWVJAT
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ukwa = new rotor('EJMZALYXVBWFCRQUONTSPIKHGD'.split(''));

const ukwb = new rotor('YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''));

const ukwc = new rotor('FVPJIAOYEDRZXWGCTKUQSBNMHL'.split(''));

//                        ABCDEFGHIJKLMNOPQRSTUVWXYZ
const rotorI = new rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split(''), 7);

//                         ABCDEFGHIJKLMNOPQRSTUVWXYZ
const rotorII = new rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''), 25);

//                          ABCDEFGHIJKLMNOPQRSTUVWXYZ
const rotorIII = new rotor('BDFHJLCPRTXVZNYEIWGAKMUSQO'.split(''), 11);

const rotorIV = new rotor('ESOVPZJAYQUIRHXLNFTGKDCMWB'.split(''), 6);

const rotorV = new rotor('VZBRGITYUPSDNHLXAWMJQOFECK'.split(''), 1);


/*class I extends rotor {

  //             ABCDEFGHIJKLMNOPQRSTUVWXYZ
  this.wiring = 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split('');
  this.notchIndex = 14; // Y
  this.turnoverIndex = 7; // Q

}

class II extends rotor {

  //             ABCDEFGHIJKLMNOPQRSTUVWXYZ
  this.wiring = 'AJDKSIRUXBLHWTMCQGZNPYFVOE'.split('');
  this.notchIndex = 14; // M
  this.turnoverIndex = 25; // E

}

class III extends rotor {

  //             ABCDEFGHIJKLMNOPQRSTUVWXYZ
  this.wiring = 'BDFHJLCPRTXVZNYEIWGAKMUSQO'.split('');
  this.notchIndex = 1; // D
  this.turnoverIndex = 11; // V

}

class IV extends rotor {

  //             ABCDEFGHIJKLMNOPQRSTUVWXYZ
  this.wiring = 'ESOVPZJAYQUIRHXLNFTGKDCMWB'.split('');
  this.notchIndex = 12; // R
  this.turnoverIndex = 6; // J

}

class V extends rotor {

  //             ABCDEFGHIJKLMNOPQRSTUVWXYZ
  this.wiring = 'VZBRGITYUPSDNHLXAWMJQOFECK'.split('');
  this.notchIndex = 13; // H
  this.turnoverIndex = 1; // Z

}*/

const increment = {

  rotor1: function() {

    r1Pos += 1;

    if (r1Pos > 25) {
      r1Pos = 0;
    }

    output.updateRotors();

    if (r1Pos == rotorI.notchIndex) {
      increment.rotor2();
    }

  },

  rotor2: function() {

    r2Pos += 1;

    if (r2Pos > 25) {
      r2Pos = 0;
    }

    output.updateRotors();

    if (r2Pos == rotorII.notchIndex) {
      increment.rotor3();
    }

  },

  rotor3: function() {

    r3Pos += 1;

    if (r3Pos > 25) {
      r3Pos = 0;
    }

    output.updateRotors();

  }

}

const passThrough = {

  plugboard: function(keyIn) {

    // Gets the index of the letter from the alphabet
    const pinIn = get.keyIndex(keyIn);

    // Gets the matched letter from the plugboard
    const keyOut = plugArr[pinIn];

    return passThrough.etw(keyOut);

  },

  etw: function(keyIn) {

    //console.log('ETW key in:', keyIn)

    // Gets the index of the letter from the alphabet
    const pinIn = get.keyIndex(keyIn);

    // As Entry Disk does not scramble, output is same as input
    const pinOut = pinIn;

    //console.log('ETW key out:', alphabet[pinIn])

    return passThrough.rotor1(pinOut);

  },

  rotor1: function(pinIn) {

    // Calculates the pin which will receive signal after rotation
    pinIn += (r1Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    //console.log('R1 pin in:', pinIn)

    // Gets the letter that has been received
    const keyIn = alphabet[pinIn];

    //console.log('R1 key in:', keyIn)

    const keyOut = rotorI.wiring[pinIn]

    // Gets the index of where that letter is connected to on the output side of the disk
    const pinOut = get.keyIndex(keyOut);

    //console.log('R1 key out:', keyOut)


    return passThrough.rotor2(pinOut);

  },

  rotor2: function(pinIn) {

    // Calculates the pin which will receive signal after rotation
    pinIn -= (r1Pos - r2Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    // Gets the letter that has been received
    const keyIn = alphabet[pinIn];

    //console.log('R2 key in:', keyIn)

    const keyOut = rotorII.wiring[pinIn]

    // Gets the index of where that letter is connected to on the output side of the disk
    const pinOut = get.keyIndex(keyOut);

    //console.log('R2 key out:', keyOut)

    return passThrough.rotor3(pinOut);

  },

  rotor3: function(pinIn) {

    // Calculates the pin which will receive signal after rotation
    pinIn -= (r2Pos - r3Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    //console.log('R3 pinIn:', pinIn)

    // Gets the letter that has been received
    const keyIn = alphabet[pinIn];

    //console.log('R3 key in:', keyIn)

    const keyOut = rotorIII.wiring[pinIn]

    // Gets the index of where that letter is connected to on the output side of the disk
    const pinOut = get.keyIndex(keyOut);

    //console.log('R3 key out:', alphabet[pinOut])

    return passThrough.reflector(pinOut);
  },

  reflector: function(pinIn) {

    // Calculates the pin which will receive signal after rotation
    pinIn -= r3Pos;

    //console.log('Reflector pinIn:', pinIn)

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    const keyIn = alphabet[pinIn];

    //console.log('Reflector key in:', keyIn)

    const keyOut = ukwb.wiring[pinIn];

    const pinOut = get.keyIndex(keyOut)

    //console.log('Reflector key out:', keyOut)

    return passBack.rotor3(pinOut);

  }

}

const passBack = {

  rotor3: function(pinIn) {

    // Calculates the pin which will receive signal
    pinIn += (r3Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    // Gets the letter that has been received
    const keyIn = alphabet[pinIn];

    //console.log('R3 key in:', keyIn)

    const keyOut = alphabet[get.keyIndex(keyIn, rotorIII.wiring)]

    // Gets the index of where that letter is connected to on the output side of the disk
    const pinOut = get.keyIndex(keyOut);

    //console.log('R3 key out:', keyOut)

    return passBack.rotor2(pinOut);

  },

  rotor2: function(pinIn) {

    // Calculates the pin which will receive signal
    pinIn += (r2Pos - r3Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    // Gets the letter that has been received
    const keyIn = alphabet[pinIn];

    //console.log('R2 key in:', keyIn)

    const keyOut = alphabet[get.keyIndex(keyIn, rotorII.wiring)]

    // Gets the index of where that letter is connected to on the output side of the disk
    const pinOut = get.keyIndex(keyOut);

    //console.log('R2 key out:', keyOut)

    return passBack.rotor1(pinOut);

  },

  rotor1: function(pinIn) {

    // Calculates the pin which will receive signal
    pinIn += (r1Pos - r2Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    // Gets the letter that has been received
    const keyIn = alphabet[pinIn];

    //console.log('R1 key in:', keyIn)

    const keyOut = alphabet[get.keyIndex(keyIn, rotorI.wiring)]

    // Gets the index of where that letter is connected to on the output side of the disk
    const pinOut = get.keyIndex(keyOut);

    //console.log('R1 key out:', keyOut)

    return passBack.etw(pinOut);

  },

  etw: function(pinIn) {

    // Calculates the pin which will receive signal
    pinIn -= (r1Pos);

    if (pinIn > 25) {
      pinIn -= 26;
    } else if (pinIn < 0) {
      pinIn += 26
    }

    //console.log('ETW key in:', alphabet[pinIn])

    // As Entry Disk does not scramble, output is same as input
    const pinOut = pinIn;

    const keyOut = alphabet[pinOut];

  //  console.log('ETW key in:', keyOut)

    return passBack.plugboard(keyOut);

  },

  plugboard: function(keyIn) {

    //console.log('Plugboard key in:', keyIn)

    // Gets the index of the letter from the alphabet
    const pinIn = get.keyIndex(keyIn);

    // Gets the matched letter from the plugboard
    const keyOut = plugArr[pinIn];

    //console.log('Plugboard key out:', keyOut)

    console.log('Returned Key: ', keyOut);

    //increment.rotor1();

    return keyOut;

  }

}

const output = {

  updateRotors: function() {

    $('#r1').val(r1Pos + 1);
    $('#r2').val(r2Pos + 1);
    $('#r3').val(r3Pos + 1);

  },

  updateText: function(keyIn, keyOut) {

    $('#textIn').append(keyIn);
    $('#textOut').append(keyOut);

  },

  sendKey: function(keyIn) {

    var keyOut = passThrough.plugboard(keyIn);
    output.updateText(keyIn, keyOut);
    increment.rotor1();

  }

}


$(document).ready(function() {

  $('#keyInput').keydown(function() {

    setTimeout(function() {
      var keyIn = $('#keyInput').val().toUpperCase();

      if (get.keyIndex(keyIn) != false) {
        output.sendKey(keyIn);
      }

    }, 50);

    // Resets box for next key input
    setTimeout(function() {
      $('#keyInput').val('');
    }, 100);

  });

  $('#stringEncrypt').click(function() {

    var splitStringInput = $('#stringInput').val().toUpperCase().split('');

    for (var i = 0; i < splitStringInput.length; i++) {
      if (get.keyIndex(splitStringInput[i]) != false) {
        output.sendKey(splitStringInput[i]);
      }
    }

  });

  $('#r1').change(function() {
    r1Pos = parseInt($(this).val() - 1, 10);
    output.updateRotors();
  });

  $('#r2').change(function() {
    r2Pos = parseInt($(this).val() - 1, 10);
    output.updateRotors();
  });

  $('#r3').change(function() {
    r3Pos = parseInt($(this).val() - 1, 10);
    output.updateRotors();
  });


});

output.updateRotors();
