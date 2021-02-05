$(document).ready(function() {

  function fadeOutIn(toFadeOut, toFadeIn) {
    return new Promise(function(resolve) {
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

  $(document).on("keypress", function (e) {
    if (e.which === 13) {
      e.preventDefault();
      var player = players[playerCounter];
      player.total += player.breaks[0].score;
      $('#playerScore' + playerCounter).text(player.total);
      nextPlayer();
    }
  });

  function gatherResults() {
    var results = [];
    var highscore = 0;
    var winnerName = 'None';
    for (var i = 0; i < players.length; i++) {
      // Result Cards
      var result = new Result();
      result.name = players[i].name
      result.total = players[i].total
      if (result.total > highscore) {
        highscore = result.total;
        winnerName = result.name;
      } else if (result.total === highscore) {
        highscore = result.total;
        winnerName = 'Draw';
      }


      result.breaks = players[i].breaks.length-1;
      for (var j = 0; j < players[i].breaks.length; j++) {
        if (players[i].breaks[j].foul === true) {
          result.foulBreaks++;
        }
        result.potential += players[i].breaks[j].score;
      }
      results.unshift(result);
      $('#resultsList').prepend('<li><div class="resultCard"><h3 style="margin: 0 0 10px 0; padding: 5px;">' + result.name + '</h3><ul><li>Total: ' + result.total + '</li><li>Breaks: ' + result.breaks + '</li><li>Foul Breaks: ' + result.foulBreaks + '</li><li>Potential Score: ' + result.potential + '</li></ul></div></li>');
    }
    $('#winner').text(winnerName)
    populateChart();
    
    //console.log('Results: ', results)
  };

  function rematch() {
    $.when($('#resultsList').html('<li><div class="resultCard"><canvas id="compareChart" width=window.innerWidth height="180"></canvas></div></li>')).then(function() {
      compareCtx = $('#compareChart')[0].getContext('2d');
      compareChart = new Chart(compareCtx, {
        type: 'line',

        options: {
          elements: {
            line: {
              tension: .2,
            }
          },
        }
      });
    });
    
    for (var i = 0; i < players.length; i++) {
      var nameTemp = players[i].name;
      players[i] = new Player(nameTemp);
      $('#playerScore' + i).text(0);
    }
    $('#currentBreakScore').text(0)
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

    toggleActive(0);
  });

  function addPlayer() {
    playerName = $('#playerNameInput').val();
    for (var i = 0; i < players.length; i++) {
      if (players[i].name === playerName) {
        alert('Error, duplicate name');
        return;
      }
    }
    var newPlayer = new Player();
    newPlayer.name = playerName;
    players.push(newPlayer);

    $('#playerSetupList').append('<li id="liSetup' + playerName + '" style="font-weight: 700;">' + playerName + '</li>');

    $('#playerList').append('<li id="li' + playerName + '">' + playerName + ' > <span style="font-weight: bold; font-size: 42px;" id="playerScore' + (players.length-1) + '">0</span><span class="bankPlusBreak" style="display: none; font-size: 34px; color: #a1b0bf;"> > 0</span></li>');
    $('#playerNameInput').val('');
  }

  function toggleActive(counter) {
    // naming will be name precursed by 'li' > liLee
    var activePlayerLi = '#li' + players[counter].name
    $(activePlayerLi).toggleClass('activePlayer', 150);
    $(activePlayerLi + '> .bankPlusBreak').toggle(150);
    $(activePlayerLi + '> .bankPlusBreak').text(' > ' + players[counter].total);
  }

  players = [];
  playerCounter = 0;

  function nextPlayer() {
    players[playerCounter].accumulative.push(players[playerCounter].total)
    players[playerCounter].breaks.unshift(new Break())
    toggleActive(playerCounter);
    if (playerCounter < players.length-1) {
      playerCounter += 1;
    } else {
      playerCounter = 0;
    }
    toggleActive(playerCounter);
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
    var activePlayerLi = '#li' + players[playerCounter].name
    // takes score value from button text content
    player.breaks[0].score += parseInt($(this)[0].textContent, 10);
    $('#currentBreakScore').text(player.breaks[0].score)
    $(activePlayerLi + '> .bankPlusBreak').text(' > ' + parseInt(player.breaks[0].score + players[playerCounter].total, 10));
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


  var chartData = [];
  var chartColours = ['#5085a5', '#687864', '#50a59c', '#a55050'];

  function populateChart() {
    var mostBreaks = 0;
    chartData = [];
    for (var i = 0; i < players.length; i++) {
      var breaksLength = players[i].breaks.length;
      var tempChartPlayer = new ChartPlayer();
      tempChartPlayer.name = players[i].name;
      tempChartPlayer.data = players[i].accumulative;
      tempChartPlayer.data.unshift(0);

      if (breaksLength > mostBreaks) {
        mostBreaks = breaksLength;
      }

      if (i < chartColours.length) {
        tempChartPlayer.colour = chartColours[i];
      } else {
        tempChartPlayer.colour = '#888';
      }
      chartData.push(tempChartPlayer);
      compareChart.data.datasets.push({
        label: tempChartPlayer.name,
        pointRadius: 0,
        pointHitRadius: 8,
        borderWidth: 2.5,
        // backgroundColor: 'rgba(219, 36, 24, .2)',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: tempChartPlayer.colour,
        data: tempChartPlayer.data
      });
    }

    var chartLabels = new Array(mostBreaks);
    for (var i = 0; i < mostBreaks; i++) {
      chartLabels[i] = i;
    }

    chartLabels[0] = 'Start'

    console.log(chartData)
    compareChart.data.labels = chartLabels;
    compareChart.update();
    
    
  };

  var compareCtx = $('#compareChart')[0].getContext('2d');
  var compareChart = new Chart(compareCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
    }
  });
});

// Player Constructor
var Player = function(nameIn = null) {
  return {
    name: nameIn,
    breaks: [new Break()],
    total: 0,
    accumulative: []
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

var ChartPlayer = function() {
  return {
    name: null,
    colour: null,
    data: null
  }
}
