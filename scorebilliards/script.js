$(document).ready(function() {

  function fadeOutIn(toFadeOut, toFadeIn) {
    return new Promise(function(resolve, reject) {
      $.when(toFadeOut.fadeOut(100)).then(function() {
        toFadeIn.fadeIn(300);
        toFadeIn.css('filter', 'blur(0)');
      }).then(function() {
        setTimeout(function() {
          resolve();
        }, 400);
      })
      
    });

  };

  function gatherResults() {
    $('#resultsList').html('');
    var results = [];
    var highscore = 0;
    var winnerName = 0;
    for (var i = 0; i < players.length; i++) {
      var result = new Result();
      result.name = players[i].name
      result.total = players[i].total
      if (result.total > highscore) {
        highscore = result.total;
        winnerName = result.name;
      }
      result.breaks = players[i].breaks.length-1;
      for (var j = 0; j < players[i].breaks.length; j++) {
        if (players[i].breaks[j].foul === true) {
          result.foulBreaks++;
        }
        result.potential += players[i].breaks[j].score;
      }
      results.unshift(result);
      $('#resultsList').append('<li><div class="resultCard"><h3 style="margin: 0 0 10px 0; padding: 5px;">' + result.name + '</h3><ul><li>Total: ' + result.total + '</li><li>Breaks: ' + result.breaks + '</li><li>Foul Breaks: ' + result.foulBreaks + '</li><li>Potential Score: ' + result.potential + '</li></ul></div></li>');
    }
    $('#winner').text(winnerName)
    
    console.log('Results: ', results)
  };

  function rematch() {
    for (var i = 0; i < players.length; i++) {
      players[i].total = 0;
      players[i].breaks = [new Break()];
      $('#playerScore' + i).text(0);
    }
    fadeOutIn($('#afterGame'), $('#inGame'));
  }

  function reset() {
    $('#btnNewGame').show(0);
    $('#addPlayer').hide(0);
    $.when(fadeOutIn($('#afterGame'), $('#beforeGame'))).then(function() {
      location.reload();
    });
  };


  $('#btnNewGame').click(function() {

    fadeOutIn($('#btnNewGame'), $('#addPlayer'));

  });

  $('#btnAnotherPlayer').click(function() {
    if ($('#playerNameInput').val() != '') {
      addPlayer();
    }
    if (players.length > 0) {
      $('#btnFinishPlayer').fadeIn(200)
    }
    $('#playerNameInput').focus();
  });

  $('#btnFinishPlayer').click(function() {
    if ($('#playerNameInput').val() != '') {
      addPlayer();
    }
    setTimeout(function() {
      fadeOutIn($('#beforeGame'), $('#inGame'));
    }, 250);

    highlightActive(0);
  });

  function addPlayer() {
    playerName = $('#playerNameInput').val();
    for (var i = 0; i < players.length; i++) {
      if (players[i].name === playerName) {
        alert('Error, duplicate name')
        return;
      }
    }
    var newPlayer = new Player();
    newPlayer.name = playerName;
    players.push(newPlayer);

    $('#playerSetupList').append('<li id="liSetup' + playerName + '" style="font-weight: 700;">' + playerName + '</li>');

    $('#playerList').append('<li id="li' + playerName + '">' + playerName + ' > <span style="font-weight: bold; font-size: 42px;" id="playerScore' + (players.length-1) + '">0</span></li>');
    $('#playerNameInput').val('')
  }

  function highlightActive(counter) {
    // naming will be name followed by 'li' > liLee
    var activePlayerLi = '#li' + players[counter].name
    $(activePlayerLi).toggleClass('activePlayer', 150)
  }

  players = [];
  playerCounter = 0;

  function nextPlayer() {
    players[playerCounter].breaks.unshift(new Break())
    highlightActive(playerCounter);
    if (playerCounter < players.length-1) {
      playerCounter += 1;
    } else {
      playerCounter = 0;
    }
    highlightActive(playerCounter);
    $('#currentBreakScore').text(0)
  }

  $('#btnSafe').click(function() {
    var player = players[playerCounter];
    player.total += player.breaks[0].score;
    $('#playerScore' + playerCounter).text(player.total);
    nextPlayer();
  });

  $('#btnFoul').click(function() {
    var player = players[playerCounter];
    player.breaks[0].foul = true;
    nextPlayer();
  });

  $('#btnBlack').click(function() {
    var player = players[playerCounter];
      player.breaks[0].foul = true;
      player.total = 0;
      $('#playerScore' + playerCounter).text(player.total);
      nextPlayer();
  });

  $('#additions > button').click(function() {
    var player = players[playerCounter];
    // takes score value from button text content
    player.breaks[0].score += parseInt($(this)[0].textContent, 10);
    $('#currentBreakScore').text(player.breaks[0].score)
  });

  $('#btnEndGame').click(function() {
    gatherResults();
    fadeOutIn($('#inGame'), $('#afterGame'));
  });

  $('#btnRematch').click(function() {
    rematch();
  });

  $('#btnReset').click(function() {
    reset();
  });
});

// Player Constructor
var Player = function() {
  return {
    name: null,
    breaks: [new Break()],
    total: 0
  }
};

// Break Constructor
var Break = function() {
  return {
    score: 0,
    foul: false
  }
}

var Result = function() {
  return {
    name: null,
    breaks: 0,
    foulBreaks: 0,
    total: 0,
    potential: 0
  }
}
