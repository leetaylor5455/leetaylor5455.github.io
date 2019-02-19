$(document).ready(function() {


  $('#btnNewGame').click(function() {
    $('#addPlayer').show(100);
    $(this).hide();
    $('#playerNameInput').focus();
  });

  $('#btnAnotherPlayer').click(function() {
    if ($('#playerNameInput').val() != '') {
      addPlayer();
    }
    if (players.length > 0) {
      $('#btnFinishPlayer').show(100);
    }
    $('#playerNameInput').focus();
  });

  $('#btnFinishPlayer').click(function() {
    if ($('#playerNameInput').val() != '') {
      addPlayer();
    }
    $('#beforeGame').hide(100)
    $('#inGame').show(100);
    highlightActive(0)
  });

  function addPlayer() {
    playerName = $('#playerNameInput').val();
    var newPlayer = new Player();
    newPlayer.name = playerName;
    players.push(newPlayer);
    $('#playerList').append('<li id="li' + playerName + '">' + playerName + ' - <span style="font-weight: bold" id="playerScore' + (players.length-1) + '">0</span></li>');
    $('#playerNameInput').val('')
    console.log(players);
  }

  function highlightActive(counter) {
    // naming will be name followed by 'li' > liLee
    var activePlayerLi = '#li' + players[counter].name
    $(activePlayerLi).toggleClass('activePlayer')
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
    console.log('Player: ', player)
    nextPlayer();
  });

  $('#btnFoul').click(function() {
    var player = players[playerCounter];
    player.breaks[0].score = 0;
    player.breaks[0].foul = true;
    nextPlayer();
  });

  $('#btnBlack').click(function() {
    var player = players[playerCounter];
      player.breaks[0].score = 0;
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
    console.log(players[0].breaks[players[0].breaks.length-1])
    var total10 = 0;
    for (var i = 0; i < players.length-1; i++) {
      for (var j = 0; j < players[i].breaks.length-1; j++) {
        total10 += players[i].breaks[j].in10;
      }
    }

    console.log(total10)
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
