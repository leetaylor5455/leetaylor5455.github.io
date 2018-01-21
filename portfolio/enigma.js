var r1Pos = 1;
var r2Pos = 1;
var r3Pos = 1;


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
  }

}


// Temp
const plugArr = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'.split('');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const ukwa = new rotor('EJMZALYXVBWFCRQUONTSPIKHGD'.split(''));

const ukwb = new rotor('YRUHQSLDPXNGOKMIEBFZCWVJAT'.split(''));

const ukwc = new rotor('FVPJIAOYEDRZXWGCTKUQSBNMHL'.split(''));

const rotorI = new rotor('EKMFLGDQVZNTOWYHXUSPAIBRCJ'.split(''), 7);

const rotorII = new rotor('AJDKSIRUXBLHWTMCQGZNPYFVOE'.split(''), 25);

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

    if (r1Pos > 26) {
      r1Pos = 1;
    }

    output.updateRotors();

    if (r1Pos == rotorI.notchIndex + 1) {
      increment.rotor2(r1Pos, r2Pos, r3Pos);
    }

  },

  rotor2: function() {

    r2Pos += 1;

    if (r2Pos > 26) {
      r2Pos = 1;
    }

    output.updateRotors();

    if (r2Pos == rotorII.notchIndex + 1) {
      increment.rotor3();
    }

  },

  rotor3: function() {

    r3Pos += 1;

    if (r3Pos > 26) {
      r3Pos = 1;
    }

    output.updateRotors();

  }

}

const passThrough = {

  plugboard: function(keyIn) {

    // Gets the index of the letter from the alphabet
    const keyInIndex = get.keyIndex(keyIn);

    // Gets the matched letter from the plugboard
    const keyOut = plugArr[keyInIndex];

    passThrough.etw(keyOut);

  },

  etw: function(keyIn) {

    // Gets the index of the letter from the alphabet
    const keyInIndex = get.keyIndex(keyIn);

    // As Entry Disk does not scramble, output is same as input
    const keyOutIndex = keyInIndex;

    passThrough.rotor1(keyOutIndex);

  },

  rotor1: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex += (r1Pos - 1);

    if (keyInIndex > 25) {
      keyInIndex -= 26;
    }

    // Gets the letter that has been received
    const keyIn = alphabet[keyInIndex];

    // Gets the index of where that letter is connected to on the output side of the disk
    const keyOutIndex = get.keyIndex(keyIn, rotorI.wiring);

    passThrough.rotor2(keyOutIndex);

  },

  rotor2: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex += (r2Pos - 1);

    if (keyInIndex > 25) {
      keyInIndex -= 26;
    }

    // Gets the letter that has been received
    const keyIn = alphabet[keyInIndex];

    // Gets the index of where that letter is connected to on the output side of the disk
    const keyOutIndex = get.keyIndex(keyIn, rotorII.wiring);

    passThrough.rotor3(keyOutIndex);

  },

  rotor3: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex += (r3Pos - 1);

    if (keyInIndex > 25) {
      keyInIndex -= 26;
    }

    // Gets the letter that has been received
    const keyIn = alphabet[keyInIndex];

    // Gets the index of where that letter is connected to on the output side of the disk
    const keyOutIndex = get.keyIndex(keyIn, rotorIII.wiring);

    passThrough.reflector(keyOutIndex);
  },

  reflector: function(keyInIndex) {

    keyInIndex -= (r3Pos + 1);

    if (keyInIndex < 0) {
      keyInIndex += 26;
    }

    const keyIn = ukwa.wiring[keyInIndex];

    const keyOutIndex = get.keyIndex(keyIn);

    passBack.rotor3(keyOutIndex);

  }

}

const passBack = {

  rotor3: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex -= (r3Pos + 1);

    if (keyInIndex < 0) {
      keyInIndex += 26;
    }

    // Gets the letter that has been received
    const keyIn = rotorIII.wiring[keyInIndex];

    // Gets the index of where that letter is connected to on the output side of the disk
    const keyOutIndex = get.keyIndex(keyIn);

    passBack.rotor2(keyOutIndex);

  },

  rotor2: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex -= (r2Pos + 1);

    if (keyInIndex < 0) {
      keyInIndex += 26;
    }

    // Gets the letter that has been received
    const keyIn = rotorII.wiring[keyInIndex];

    // Gets the index of where that letter is connected to on the output side of the disk
    const keyOutIndex = get.keyIndex(keyIn);

    passBack.rotor1(keyOutIndex);

  },

  rotor1: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex -= (r1Pos + 1);

    if (keyInIndex < 0) {
      keyInIndex += 26;
    }

    // Gets the letter that has been received
    const keyIn = rotorI.wiring[keyInIndex];

    // Gets the index of where that letter is connected to on the output side of the disk
    const keyOutIndex = get.keyIndex(keyIn);

    passBack.etw(keyOutIndex);
  },

  etw: function(keyInIndex) {

    // Calculates the pin which will receive signal
    keyInIndex += (r1Pos - 1);

    if (keyInIndex > 25) {
      keyInIndex += 26;
    }

    // As Entry Disk does not scramble, output is same as input
    const keyOutIndex = keyInIndex;

    const keyOut = alphabet[keyOutIndex];

    passBack.plugboard(keyOut);

  },

  plugboard: function(keyIn) {

    // Gets the index of the letter from the alphabet
    const keyInIndex = get.keyIndex(keyIn);

    // Gets the matched letter from the plugboard
    const keyOut = plugArr[keyInIndex];

    console.log('Returned Key: ', keyOut);

  }

}

const output = {

  updateRotors: function() {

    $('#r1').val(r1Pos);
    $('#r2').val(r2Pos);
    $('#r3').val(r3Pos);

  }

}


$(document).ready(function() {

  $('#keyInput').keydown(function() {

    setTimeout(function() {
      var keyIn = $('#keyInput').val().toUpperCase();
      passThrough.plugboard(keyIn);
    }, 50);


    setTimeout(function() {
      $('#keyInput').val('');
    }, 100);

    var r1Pos = parseInt($('#r1').val(), 10);
    var r2Pos = parseInt($('#r2').val(), 10);
    var r3Pos = parseInt($('#r3').val(), 10);

    increment.rotor1();

  });


});
