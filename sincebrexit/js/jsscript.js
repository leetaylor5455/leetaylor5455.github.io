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



  $('#EUR').click(function() {
    graphData.plots.EUR = [];
    graphData.labels.EUR = [];
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

      graphData.labels.EUR.unshift(fullDate);
    }
    getUrl();
  });

  function getUrl() {
    var getPromises = [];
    var url;
    var i = 23;

    while (i >= 0) {
      url = 'https://exchangeratesapi.io/api/' + graphData.labels.EUR[i] + '?base=GBP';

      var getPromise = $.get({
        url: url
      }).then(function(data) {
        graphData.plots.EUR.unshift(data.rates.EUR); // is this right?? Looks like it's changing the same thing for every iteration?
        // maybe it should be graphData.plots[i].EUR.unshift(data.rates.EUR); ? Just a guess
      });

      getPromises.push(getPromise);

      i--;
    }

    Promise.all(getPromises).then(function() {

      // do this once ALL the $.get requests have finished

      updateChart(graphData.labels.EUR, graphData.plots.EUR);
    });
  }
//
//   function getRate(url) {
//     return new Promise(function(resolve, reject) {
//         $.get(url, function() {}));
//     });
// }

function updateChart(labels = null, data = null) {
  if (labels == null) {
    if (data == null) {
      return;
    } else {
      console.log('Chart data :', data)
      chart.data.datasets = [{
        label: "GBP vs EUR",
        pointRadius: 0,
        pointHitRadius: 12,
        backgroundColor: gradient,
        borderColor: "#28AFFA",
        data: data,
      }]
    }
  } else if (data == null) {
    //console.log('Chart labels :', labels)
    chart.data.labels = labels;
  } else {
    console.log('Chart data :', data)
    //console.log('Chart labels :', labels)
    chart.data = {
      labels: labels,
      datasets: [{
        label: "GBP vs EUR",
        pointRadius: 0,
        pointHitRadius: 12,
        backgroundColor: gradient,
        borderColor: "#28AFFA",
        data: data,
      }]
    }
  }
  chart.update();
  console.log('Chart updated.')
}

// Charts
var ctx = document.getElementById('myChart').getContext('2d');
var gradient = ctx.createLinearGradient(0, 0, 0, 400); gradient.addColorStop(0, 'rgba(40,175,250,.25)'); gradient.addColorStop(1, 'rgba(40,175,250,0)');
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
