$(document).ready(function() {

  var rates = {};
  var graphData = {
    plots: {},
    labels: {},
    condensedLabels: {}
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
      //console.log(id + " Rate: ", rates[accessor]);
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
    var indicator = '#' + id + 'Ind'

    var returnedCalc = changeCalc(rates[beforeAccessor], rates[nowAccessor], $('#' + id), symbol)
    $(jqueryID).text(returnedCalc[0]);
    $(indicator).text(returnedCalc[1]);


    function changeCalc(rateBefore, rateNow, changer, symbol) {
      if (id == 'Unemploy') {
        if (rateNow > rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          rateChange = 'UP BY ' + rateChange + symbol + " ▲";
          var change = ' ▲'
        } else if (rateNow < rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          rateChange = 'DOWN BY ' + rateChange + symbol + " ▼";
          var change = ' ▼'
        }
      } else {
        if (rateNow < rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          var change = ' ▼'
          rateChange = 'DOWN BY' + symbol + rateChange + " ▼";

        } else if (rateNow > rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          var change = ' ▲'
          rateChange = 'UP BY' + symbol + rateChange + " ▲";

        }
      }

      return [rateChange, change];
    }
  }

  updateRatesNow('EUR', ' €');
  updateRatesNow('USD', ' $');
  updateRatesNow('CHF', ' ₣');
  updateRatesNow('GDP', ' $');
  updateRatesNow('Unemploy', '% ');
  updateRatesNow('FTSE100', ' $')

  $('#GDP').click(function() {
    graphData.labels.GDP = [];
    graphData.plots.GDP = [
      [],
      []
    ]

    for (var i = 0; i < 20; i++) {
      graphData.plots.GDP[0][i] = null;
      graphData.plots.GDP[1][i] = null;
    }


    $.get('js\\json\\gdphistoric.json', function(data) {
      for (var i = data.length - 20; i < data.length; i++) {
        graphData.labels.GDP.push(data[i][0]);
      }

      // So it still works when its 2019, 2020 etc
      var yearsSinceBrexit = parseInt(year, 10) - 2016

      var beforeBrexitArray = graphData.plots.GDP[0];
      for (var i = data.length - 20; i < data.length - yearsSinceBrexit; i++) {
        // Not sure why it's i-18 but that's what works
        beforeBrexitArray[i - 18] = data[i][1];
      }

      var sinceBrexitArray = graphData.plots.GDP[1];
      for (var i = data.length - yearsSinceBrexit - 1; i < data.length; i++) {
        sinceBrexitArray[i - 18] = data[i][1];
      }

      // Clears datasets so that they don't build up for each click
      chart.data.datasets = []
      chart.data.labels = graphData.labels.GDP

      updateGDP(beforeBrexitArray, graphData.labels.GDP, 'GDP Before Referendum')
      updateGDP(sinceBrexitArray, graphData.labels.GDP, 'GDP Since Referendum')

      function updateGDP(plotArray, labelArray, label) {
        //if (chart.data.datasets.length <= 1) {
        if (plotArray[0] < plotArray[plotArray.length - 1]) {
          var lineColor = '#f73b3b';
          var gradient = ctx.createLinearGradient(0, 0, 0, 600);
          gradient.addColorStop(0, 'rgba(226, 77, 77, .8)');
          gradient.addColorStop(.75, 'rgba(226, 77, 77, 0)');
        } else if (plotArray[0] > plotArray[plotArray.length - 1]) {
          var lineColor = '#4fc64f';
          var gradient = ctx.createLinearGradient(0, 0, 0, 600);
          gradient.addColorStop(0, 'rgba(110, 216, 110, .8)');
          gradient.addColorStop(.75, 'rgba(110, 216, 110, 0)');
        }

        chart.data.datasets.push({
          label: label,
          pointRadius: 0,
          pointHitRadius: 8,
          backgroundColor: gradient,
          borderColor: lineColor,
          data: plotArray,
        });

        // Updates after both datasets pushed
        if (chart.data.datasets.length === 2) {
          chart.update();
          console.log('Chart updated.')
        }


      }
    });
  });

  $('#EUR').ready(function() {
    calculateChart('EUR');
  });

  $('#USD').ready(function() {
    calculateChart('USD');
  });

  $('#CHF').ready(function() {
    calculateChart('CHF');
  });

  function calculateChart(currencyID) {
    graphData.plots[currencyID] = Array(23);
    graphData.labels[currencyID] = [];
    graphData.condensedLabels[currencyID] = [];
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
      condensedDate = month + '-' + String(year).substring(2, 4);

      graphData.condensedLabels[currencyID].unshift(condensedDate);
      graphData.labels[currencyID].unshift(fullDate);
    }
    getRates(currencyID);
  };

  function getRates(currencyID) {

    var getPromises = [];

    for (var i = 0; i <= 23; i++) {
      var url = 'https://exchangeratesapi.io/api/' + graphData.labels[currencyID][i] + '?base=GBP';

      //console.log('i: ' + i);

      // need to use an immediately invoked function expression (IIFE) so the value of i is
      // copied into the promise.then callback - otherwise the value of i is always the
      // last value in the loop
      (function(dataPlotIndex) {

        var getPromise = $.get({
          url: url
        }).then(function(data) {

          // place the data in the exact index in the plots array so it marries up with the label
          graphData.plots[currencyID][dataPlotIndex] = data.rates[currencyID];

          // update the label if the API has picked a different date
          graphData.labels[currencyID][dataPlotIndex] = data.date;

        });

        getPromises.push(getPromise);
      })(i);

    }

    Promise.all(getPromises).then(function() {

      // do this once ALL the $.get requests have finished
      if (graphData.plots[currencyID][0] > graphData.plots[currencyID][23]) {
        //var lineColor = '#f73b3b';
        var lineColor = '#8d0011'
        // var gradient = ctx.createLinearGradient(0, 600, 0, 0);
        // gradient.addColorStop(0, 'rgba(226, 77, 77, .8)');
        // gradient.addColorStop(.75, 'rgba(226, 77, 77, 0)');
      } else if (graphData.plots[currencyID][0] < graphData.plots[currencyID][23]) {
        var lineColor = '#4fc64f';
        // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
        // gradient.addColorStop(0, 'rgba(110, 216, 110, .8)');
        // gradient.addColorStop(.75, 'rgba(110, 216, 110, 0)');
      }

      updateChart(currencyID, graphData.condensedLabels[currencyID], graphData.plots[currencyID], 'rgba(0, 0, 0, 0)', lineColor, currencyID);
    });
  }


  function updateChart(currencyID, labels, data, gradient, lineColor, currencyID) {
    chart = currencyID + 'Chart';
    eval(chart).data = {
      labels: labels,
      datasets: [{
        label: currencyID,
        pointRadius: 0,
        pointHitRadius: 8,
        backgroundColor: 'rgba(110, 216, 110, 0)',
        borderColor: lineColor,
        data: data,
      }]
    }
    eval(chart).update();
    console.log('Chart updated.')
  }

  // Charts
  var EURCtx = $('#EURChart')[0].getContext('2d');
  var EURChart = new Chart(EURCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      // scales: {
      //   xAxes: [{
      //     display: false
      //   }],
      //   yAxes: [{
      //     display: false
      //   }]
      // },
      legend: {
        display: false
      },
    }
  });

  // Charts
  var USDCtx = $('#USDChart')[0].getContext('2d');
  var USDChart = new Chart(USDCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      // scales: {
      //   xAxes: [{
      //     display: false
      //   }],
      //   yAxes: [{
      //     display: false
      //   }]
      // },
      legend: {
        display: false
      },
    }
  });

  // Charts
  var CHFCtx = $('#CHFChart')[0].getContext('2d');
  var CHFChart = new Chart(CHFCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      // scales: {
      //   xAxes: [{
      //     display: false
      //   }],
      //   yAxes: [{
      //     display: false
      //   }]
      // },
      legend: {
        display: false
      },
    }
  });


  var cardHeight;
  // Sets the height of the back of the card to match the image in front
  function setBackHeight() {
    cardHeight = $('.front').css('height');
    console.log(cardHeight)
    $('.back .card').css('height', cardHeight);
    console.log($('.back .card').css('height'))
  }

  setBackHeight();

  $('.card-parent').addClass('not-flipped');
  //Swap behavior of hover with click on touch devices
  $('.card-parent.not-flipped').click(function() {
    $('.card-parent').addClass('flipped');
    $(this).removeClass('not-flipped');
  });

  $('.back').click(function() {
    console.log('back clicked');
    $('.card-parent').removeClass('flipped');
    $('.card-parent').addClass('not-flipped');
  });
  // if (Modernizr.touch) {
  //   $('.card-parent .back').prepend('<div class="cancel-card">\X</div>');
  //   $('.card.not-flipped').click(function() {
  //     $('.card-parent').addClass('not-flipped');
  //     $(this).removeClass('not-flipped');
  //   });
  //   $('.cancel-card').click(function(ev) {
  //     ev.stopPropagation();
  //     $('.card-parent').addClass('not-flipped');
  //   });
  // } else {
  //   $('.card-parent').hover(function() {
  //     $(this).toggleClass('not-flipped');
  //   });
  // }

});

$(window).load(function() {
  // On window change, recalculate the size of the box
  window.onresize = function() {
    setBackHeight();
  }
  setBackHeight();
});
