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
    $('#playerNameInput').focus();

  });

  $('#btnAddPlayer').click(function() {
    if ($('#playerNameInput').val() != '') {
      addPlayer();
    }
    if (players.length > 1) {
      $('#btnAddPlayer').fadeOut(200);
    }
    $('#playerNameInput').focus();
  });

  var countdownScore = 0;

  $('.scoreSetButton').click(function() {
    var $thisScoreButton = $(this);
    $('.scoreSetButton').removeClass('button-primary');
    $thisScoreButton.addClass('button-primary');
    countdownScore = parseInt($thisScoreButton.text(), 10);
    if (players.length === 2) {
      $('#btnFinishSetup').show();
    }
  });


  $('#btnFinishSetup').click(function() {


    for (var i = 0; i < 2; i++) {
      players[i].total = countdownScore;
      var $playerScore = $('#' + players[i].name + 'Score');
      $playerScore.text(countdownScore);
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
        return null;
      }
    }
    var newPlayer = new Player();
    newPlayer.name = playerName;
    players.push(newPlayer);

    $('#playerSetupList').append('<li id="liSetup' + playerName + '" style="font-weight: 700;">' + playerName + '</li>');

    $('#playerList').append('<li id="li' + playerName + '">' + playerName + ' > <span style="font-weight: bold; font-size: 42px;" id="' + playerName + 'Score">0</span><span class="scoreMinusTurn" style="display: none; font-size: 34px; color: #a1b0bf;"> > 0</span></li>');
    $('#playerNameInput').val('');

    if (countdownScore != 0 && players.length === 2) {
      $('#btnFinishSetup').show();
    }
  }

  function toggleActive(counter) {
    // naming will be name precursed by 'li' > liLee
    var activePlayerLi = '#li' + players[counter].name
    $(activePlayerLi).toggleClass('activePlayer', 150);
    $(activePlayerLi + '> .scoreMinusTurn').toggle(150);
    $(activePlayerLi + '> .scoreMinusTurn').text(' > ' + players[counter].total);
  }

  players = [];
  playerCounter = 0;

  function nextPlayer() {
    // reset double and triple buttons
    doublePoint = false;
    triplePoint = false;
    $('#btnDouble').removeClass('button-primary');
    $('#btnTriple').removeClass('button-primary');
    $('#turnScore').text(0);

    players[playerCounter].accumulative.push(players[playerCounter].total)
    players[playerCounter].turns.unshift(new Turn())
    toggleActive(playerCounter);
    if (playerCounter === 0) {
      playerCounter = 1;
    } else {
      playerCounter = 0;
    }
    toggleActive(playerCounter);
    $('#dartScore').text(0);
    $('#turnDarts').empty();
  }

  function updateProjectedScore(player, returnScore = false) {
    var activePlayerLi = '#li' + player.name;
    // adds up all dart scores
    var projectedScore = 0
    for (var i = 0; i < player.turns[0].darts.length; i++) {
        projectedScore += player.turns[0].darts[i] << 0;
    }
    // calculates and displays projected score
    projectedScore = player.total - projectedScore;

    // used when checking if dart will produce negative score, called at dart submit
    if (returnScore) {
      return projectedScore;
    } else {
      $(activePlayerLi + '> .scoreMinusTurn').text(' > ' + projectedScore);
    } 
  }


  // listener for scoring buttons
  $('#scoring > .addScore').click(function() {
    var player = players[playerCounter];
    var currentDart = player.turns[0].darts[0];
    // console.log(currentDart)

    // if double or triple are selected, additions must be multiplied
    if (doublePoint === true) {
      currentDart += parseInt($(this)[0].textContent, 10) * 2;
    } else if (triplePoint === true) {
      currentDart += parseInt($(this)[0].textContent, 10) * 3;
    } else {
      currentDart += parseInt($(this)[0].textContent, 10);
    }
    
    $('#dartScore').text(currentDart);
    player.turns[0].darts[0] = currentDart;

    updateProjectedScore(player);
  });

  var doublePoint = false;
  var triplePoint = false;

  // listener for double button
  $('#btnDouble').click(function() {
    var player = players[playerCounter];

    var currentDart = player.turns[0].darts[0];

    // checks if double is already selected, either doubles or halves score depending
    if (doublePoint === false) {
      doublePoint = true;
      currentDart *= 2;
      $(this).addClass('button-primary');
    } else {
      doublePoint = false;
      currentDart /= 2;
      $(this).removeClass('button-primary');
    }

    if (triplePoint === true) {
      currentDart /= 3;
      triplePoint = false;
      $('#btnTriple').removeClass('button-primary');
    }

    $('#dartScore').text(currentDart);
    player.turns[0].darts[0] = currentDart;

    updateProjectedScore(player);
    
  });

  // listener for triple button
  $('#btnTriple').click(function() {
    var player = players[playerCounter];

    var currentDart = player.turns[0].darts[0];

    // checks if double is already selected, either doubles or halves score depending
    if (triplePoint === false) {
      triplePoint = true;
      currentDart *= 3;
      $(this).addClass('button-primary');
    } else {
      triplePoint = false;
      currentDart /= 3;
      $(this).removeClass('button-primary');
    }

    if (doublePoint === true) {
      currentDart /= 2;
      doublePoint = false;
      $('#btnDouble').removeClass('button-primary');
    }

    $('#dartScore').text(currentDart);
    player.turns[0].darts[0] = currentDart;

    updateProjectedScore(player);
    
  });

  // listener for reset dart button
  $('#resetDart').click(function() {
    // reset double and triple buttons
    doublePoint = false;
    triplePoint = false;
    $('#btnDouble').removeClass('button-primary');
    $('#btnTriple').removeClass('button-primary');
    $('#dartScore').text(0);
    players[playerCounter].turns[0].darts[0] = 0;
    updateProjectedScore(players[playerCounter]);
  });

  // listener for submit dart button
  $('#submitDart').click(function() {


    var player = players[playerCounter];
    var dartScore = parseInt($('#dartScore').text(), 10);

    // checks to over shoot
    var projectedPlayerTotal = updateProjectedScore(player, true);
    if (projectedPlayerTotal < 0) {
      nextPlayer();
    }

    // adds up all dart scores
    var turnTotal = 0;
    for (var i = 0; i < player.turns[0].darts.length; i++) {
        turnTotal += player.turns[0].darts[i] << 0;
    }
    player.turns[0].score = turnTotal;

    // check for winning dart
    if (turnTotal === player.total) {
      if (doublePoint) {
        var winner = player.name;
        $('#winner').text(winner);
        fadeOutIn($('#inGame'), $('#afterGame'));
        console.log('Winner');
      } else {
        nextPlayer();
      }
    }

    // reset double and triple buttons
    doublePoint = false;
    triplePoint = false;
    $('#btnDouble').removeClass('button-primary');
    $('#btnTriple').removeClass('button-primary');
    
    player.turns[0].darts.unshift(0);

    $('#turnScore').text(parseInt($('#turnScore').text(), 10) + dartScore);
    $('#turnDarts').append('<li>Dart ' + (player.turns[0].darts.length - 1) + ': ' + dartScore + '</li>');
  
    // last dart
    if (player.turns[0].darts.length > 3) {

      player.total -= player.turns[0].score;
      var $playerScore = $('#' + player.name + 'Score');
      $playerScore.text(player.total);

      nextPlayer();
    }

    dartScore = 0;
    
    $('#dartScore').text(0);
    
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
    turns: [new Turn()],
    total: 0,
    accumulative: []
  }
};
// Turn Constructor
var Turn = function() {
  return {
    score: 0,
    darts: [0],

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
