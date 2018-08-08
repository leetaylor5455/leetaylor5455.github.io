$(document).ready(function() {

  //[1.0940559938, 1.1168816664, 1.1358731457, 1.1354862152, 1.1250745362, 1.1277135608, 1.1171561673, 1.1455409817, 1.1362345188, 1.1347775269, 1.1287318697, 1.1200716846]
  var rates = {};
  var graphData = {
    plots: {

    },
    labels: {

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
          rateChange = 'UP BY ' + rateChange + symbol + " ▲";
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
            rateChange = 'UP BY ' + rateChange + symbol + " ▲";
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



  $('#EUR, #USD, #CHF').click(function() {
    var currencyID = String($(this)[0].id)
    console.log(currencyID)
    graphData.plots[currencyID] = Array(23);
    graphData.labels[currencyID] = [];
    var startFullDate = new Date().toISOString().slice(0, 10);
    var day = startFullDate.substring(8, 10)
    var year = parseInt(startFullDate.substring(0, 4), 10)
    var startMonth = parseInt(startFullDate.substring(5, 7), 10)

    // Creates the dates used for url and chart labels
    for (var i = startMonth; i > startMonth - 24; i--) {
      if (i < 1) {
        if (i <= -12) {
          month = 24 + i;
        } else {
          month = 12 + i;
        }
        if (month === 0) {
          month = 12;
        }
        if (month === 12) {
          year -= 1;
        }
      } else {
        month = i;
      }
      fullDate = year + '-' + month + '-' + day;

      graphData.labels[currencyID].unshift(fullDate);
    }
    getUrl(currencyID);
  });

  function getUrl(currencyID) {

    var getPromises = [];

    for (var i = 0; i <= 23; i++) {
      var url = 'https://exchangeratesapi.io/api/' + graphData.labels[currencyID][i] + '?base=GBP';

      //console.log('i: ' + i);

      // need to use an immediately invoked function expression (IIFE) so the value of i is
      //  copied into the promise.then callback - otherwise the value of i is always the
      //  last value in the loop
      (function(dataPlotIndex) {
        //console.log('dataPlotIndex: ' + dataPlotIndex);

        var getPromise = $.get({
          url: url
        }).then(function(data) {

          // place the data in the exact index in the plots array so it marries up with the label
          //graphData.plots.EUR.splice(i, 0, data.rates.EUR);
          graphData.plots[currencyID][dataPlotIndex] = data.rates[currencyID];

          // update the label if the API has picked a different date?
          graphData.labels[currencyID][dataPlotIndex] = data.date;

        });

        getPromises.push(getPromise);
      })(i);

    }

    Promise.all(getPromises).then(function() {

      // do this once ALL the $.get requests have finished
      if (graphData.plots[currencyID][0] > graphData.plots[currencyID][23]) {
        lineColor = '#f73b3b';
        var gradient = ctx.createLinearGradient(0, 550, 0, 0);
        gradient.addColorStop(0, 'rgba(226, 77, 77,.7)');
        gradient.addColorStop(.8, 'rgba(226, 77, 77,0)');
      } else if (graphData.plots[currencyID][0] < graphData.plots[currencyID][23]) {
        lineColor = '#5ce05c';
        var gradient = ctx.createLinearGradient(0, 550, 0, 0);
        gradient.addColorStop(0, 'rgba(110, 216, 110,.7)');
        gradient.addColorStop(.8, 'rgba(110, 216, 110,0)');
      }

      updateChart(graphData.labels[currencyID], graphData.plots[currencyID], gradient, lineColor, currencyID);
    });
  }


function updateChart(labels, data, gradient, lineColor, currencyID) {
  chart.data = {
    labels: labels,
    datasets: [{
      label: currencyID,
      pointRadius: 0,
      pointHitRadius: 12,
      backgroundColor: gradient,
      borderColor: lineColor,
      data: data,
    }]
  }
  chart.update();
  console.log('Chart updated.')
}

// Charts
var ctx = document.getElementById('myChart').getContext('2d');
var gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(40,175,250,.25)');
gradient.addColorStop(1, 'rgba(40,175,250,0)');
//console.log(graphPlots)

var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: [],
    datasets: [{
      label: "GBP vs EUR",
      pointRadius: 0,
      pointHitRadius: 12,
      backgroundColor: gradient,
      borderColor: "#28AFFA",
      data: [],
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
