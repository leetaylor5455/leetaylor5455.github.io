$(document).ready(function() {

  //[1.0940559938, 1.1168816664, 1.1358731457, 1.1354862152, 1.1250745362, 1.1277135608, 1.1171561673, 1.1455409817, 1.1362345188, 1.1347775269, 1.1287318697, 1.1200716846]
  var rates = {};
  var graphData = {
    plots: {
      EUR: []
    },
    labels: {
      EUR: []
    }
  };

  // Date Function
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  var d = new Date();

  var month = monthNames[d.getMonth()];
  var day = d.getDate();
  var dayString = '' + day;
  var year = '' + d.getFullYear();


  day = String(day);

  if (day.length < 2) {
    var dateIndex = 0;
  } else {
    var dateIndex = 1;
  }


  if (day.charAt(dateIndex) == 1) {
    day = day + "st ";
  } else if (day.charAt(dateIndex) == 2) {
    day = day + "nd ";
  } else if (day.charAt(dateIndex) == 3) {
    day = day + "rd ";
  } else {
    day = day + "th ";
  }

  var fullDate = day + month + " " + year;


  $('.dateNow').text(fullDate);

  // Update New Rates
  function updateRatesNow(id, symbol) {
    var accessor = id + 'Now';

    $.get("js\\json\\rates.json", function(returnedVals) {
      rates[accessor] = returnedVals.rates[id].toFixed(2);
      console.log(id + " Rate: ", rates[accessor]);
      var jqueryID = '#' + id + 'Now';
      if (id == 'Unemploy') {
        $(jqueryID).text(rates[accessor] + symbol);
      } else {
        $(jqueryID).text(symbol + rates[accessor]);
      }

      updateRatesBefore(id, symbol);
    });
  }

  function updateRatesBefore(id, symbol) {
    var accessor = id + 'Before';

    $.get("js\\json\\ratesbefore.json", function(returnedVals) {
      rates[accessor] = returnedVals.rates[id].toFixed(2);
      var jqueryID = '#' + id + 'Before';
      if (id == 'Unemploy') {
        $(jqueryID).text(rates[accessor] + symbol);
      } else {
        $(jqueryID).text(symbol + rates[accessor]);
      }

      updateRatesChange(id, symbol);
    });
  }

  function updateRatesChange(id, symbol) {
    var beforeAccessor = id + 'Before';
    var nowAccessor = id + 'Now';

    var jqueryID = '#' + id + 'Change';

    $(jqueryID).text(changeCalc(rates[beforeAccessor], rates[nowAccessor], $('#' + id), symbol));

    function changeCalc(rateBefore, rateNow, changer, symbol) {
      if (id == 'Unemploy') {
        if (rateNow > rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateNow - rateBefore).toFixed(2);
            rateChange = 'UP BY ' +  rateChange + symbol + " ▲";
        } else if (rateNow < rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateBefore - rateNow).toFixed(2);
            rateChange = 'DOWN BY ' + rateChange + symbol + " ▼";
        }
      } else {
        if (rateNow < rateBefore) {
        changer.addClass('rate-down');
        var rateChange = (rateBefore - rateNow).toFixed(2);
        if (symbol == '% ') {
          rateChange = 'UP BY ' +  rateChange + symbol + " ▲";
        } else {
          rateChange = 'DOWN BY' + symbol + rateChange + " ▼";
        }
        } else if (rateNow > rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          if (symbol == '% ') {
            rateChange = 'DOWN BY ' + rateChange + symbol + " ▼";
          } else {
            rateChange = 'UP BY' + symbol + rateChange + " ▲";
          }
        }
      }

      return rateChange;
    }
  }

  updateRatesNow('EUR', ' €');
  updateRatesNow('USD', ' $');
  updateRatesNow('CHF', ' ₣');
  updateRatesNow('GDP', ' $');
  updateRatesNow('Unemploy', '% ');
  updateRatesNow('FTSE100', ' $')



  $('#EUR').click(function() {
    if (graphData.labels.EUR.length < 1) {
      var startFullDate = new Date().toISOString().slice(0, 10);
      var day = startFullDate.substring(8, 10)
      var year = parseInt(startFullDate.substring(0, 4), 10)
      var startMonth = parseInt(startFullDate.substring(5, 7), 10)

      // Creates the dates used for url and chart labels
      for (var i = startMonth; i > startMonth-12; i--) {
        if (i < 1) {
          month = 12 + i;
          if (month === 12) {
            year -= 1;
          }
        } else {
          month = i;
        }
        fullDate = year + '-' + month + '-' + day;
        graphData.labels.EUR.unshift(fullDate);
      }
      getUrl();

    }
  });

  function getUrl() {
    for (var i=11; i >= 0; i--) {
      url = 'https://exchangeratesapi.io/api/' + graphData.labels.EUR[i] + '?base=GBP';
      getRate(url).done(function(data) {
        console.log(data.rates.EUR)
        graphData.plots.EUR.push(data.rates.EUR);
      });
    }
    chart.update();
    console.log('chart updated');
  }

  function getRate(url) {
    return $.get(url, function(data) {});
  }


  // Charts
  var ctx = document.getElementById('myChart').getContext('2d');
  var gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(74, 224, 100,.5)');
  gradient.addColorStop(1, 'rgba(74, 224, 100,0)');
  //console.log(graphPlots)

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: graphData.labels.EUR,
        datasets: [{
            label: "GBP vs EUR",
            backgroundColor: gradient,
            borderColor: "#42f462",
            data: graphData.plots.EUR,
        }]
    },

    // Configuration options go here
    options: {
      elements: {
        line: {
            tension: .2, // disables bezier curves
        }
      }
    }
  });


});
