$(document).ready(function() {

  players = [];
  playerCounter = 0;

  function addPlayer() {
    playerName = prompt('Enter player name: ');
    var player = new Player();
    player.name = playerName;
    players.push(player);
    console.log(players)
    $('#playerList').append('<li>' + playerName + ' - <span style="font-weight: bold" id="playerScore' + (players.length-1) + '">0</span></li>')
  }

  function nextPlayer() {
    players[playerCounter].breaks.unshift(new Break())
    if (playerCounter < players.length-1) {
      playerCounter += 1;
    } else {
      playerCounter = 0;
    }
    $('#currentPlayer').text(players[playerCounter].name)
    $('#currentBreakScore').text(0)
  }

  $('button').click(function() {
    var buttonClicked = $(this)[0];
    if (buttonClicked.id == 'btnAddPlayer') {
      addPlayer();
      var player = players[playerCounter];
      if (playerCounter === 0) {
        $('#currentPlayer').text(players[playerCounter].name)
      }

    } else if (buttonClicked.id == 'btnEnd') {
      var player = players[playerCounter];
      player.total += player.breaks[0].score;
      $('#playerScore' + playerCounter).text(player.total);
      console.log('Player: ', player)
      nextPlayer();

    } else if (buttonClicked.id == 'btnFoul') {
      var player = players[playerCounter];
      player.breaks[0].score = 0;
      player.breaks[0].foul = true;
      nextPlayer();

    } else if (buttonClicked.id == 'btnBlack') {
      var player = players[playerCounter];
      player.breaks[0].score = 0;
      player.breaks[0].foul = true;
      player.total = 0;
      $('#playerScore' + playerCounter).text(player.total);
      nextPlayer();

    } else {
      var player = players[playerCounter];
      player.breaks[0].score += parseInt($(this)[0].textContent, 10);
      $('#currentBreakScore').text(player.breaks[0].score)
      switch (buttonClicked.id) {
        case 'btn10':
          player.breaks[0].in10++
          break;
        case 'btn20':
          player.breaks[0].in20++
          break;
        case 'btn30':
          player.breaks[0].in30++
          break;
        case 'btn50':
          player.breaks[0].in50++
          break;
        case 'btn100':
          player.breaks[0].in100++
          break;
        case 'btn200':
          player.breaks[0].in200++
          break;
      }
    }
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
    in10: 0,
    in20: 0,
    in30: 0,
    in50: 0,
    in100: 0,
    in200: 0,
    foul: false
  }
}
