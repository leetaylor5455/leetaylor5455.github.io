$(document).ready(function() {

  // $('.grid').masonry({
  //   // options
  //   itemSelector: '.grid-item',
  //   columnWidth: '.grid-sizer',
  //   percentPosition: true
  // });

  var rates = {};
  var graphData = {
    plots: {},
    urlDates: {},
    labels: {},
  };

  var compareIndex = 0;

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

  if (parseInt(day, 10) > 10 && parseInt(day, 10) < 20) {
    day = day + "th ";
  } else if (day.charAt(dateIndex) == 1) {
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

    var returnedCalc = changeCalc(rates[beforeAccessor], rates[nowAccessor], $('#' + id), symbol);

    $(jqueryID).text(returnedCalc[0]);
    $(indicator).text(returnedCalc[1]);

    if (returnedCalc[1] === ' ▲') {
      if (id == 'Unemploy') {
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
      } else {
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
      }

    } else {
      if (id == 'Unemploy') {
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
      } else {
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
      }

    }




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
  updateRatesNow('FTSE100', ' ');


  $('#GDP').ready(function() {
    graphData.urlDates.GDP = [];
    graphData.plots.GDP = [[],[]];

    for (var i = 0; i < 20; i++) {
      graphData.plots.GDP[0][i] = null;
      graphData.plots.GDP[1][i] = null;
    }


    $.get('js\\json\\gdphistoric.json', function(data) {
      for (var i = data.length - 20; i < data.length; i++) {
        graphData.urlDates.GDP.push(data[i][0]);
      }

      // So it still works when its 2019, 2020 etc
      var yearsSinceBrexit = parseInt(year, 10) - 2016

      var beforeBrexitArray = graphData.plots.GDP[0];
      for (var i = data.length - 20; i < data.length - yearsSinceBrexit; i++) {
        // Not sure why it's i-18 but that's what works
        beforeBrexitArray[i - 18] = ((data[i][1])/1000).toFixed(2);
      }

      var sinceBrexitArray = graphData.plots.GDP[1];
      for (var i = data.length - yearsSinceBrexit - 1; i < data.length; i++) {
        sinceBrexitArray[i - 18] = ((data[i][1])/1000).toFixed(2);
      }

      // Clears datasets so that they don't build up for each click
      GDPChart.data.datasets = []
      for (var i = 0; i < graphData.urlDates.GDP.length; i++) {
        GDPChart.data.labels.push(parseInt(graphData.urlDates.GDP[i].substring(0, 4), 10) + 1)
      }
      //GDPChart.data.labels = graphData.urlDates.GDP

      updateGDP(beforeBrexitArray, graphData.urlDates.GDP, 'Before Ref.')
      updateGDP(sinceBrexitArray, graphData.urlDates.GDP, 'Since Ref.')

      function updateGDP(plotArray, labelArray, label) {
        //if (chart.data.datasets.length <= 1) {
        if (plotArray[0] < plotArray[plotArray.length - 1]) {
          var lineColor = '#8d0011'
          // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
          // gradient.addColorStop(0, 'rgba(226, 77, 77, .8)');
          // gradient.addColorStop(.75, 'rgba(226, 77, 77, 0)');
        } else if (plotArray[0] > plotArray[plotArray.length - 1]) {
          var lineColor = '#0caf19';
          // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
          // gradient.addColorStop(0, 'rgba(110, 216, 110, .8)');
          // gradient.addColorStop(.75, 'rgba(110, 216, 110, 0)');
        }

        GDPChart.data.datasets.push({
          label: label,
          pointRadius: 0,
          pointHitRadius: 8,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: lineColor,
          data: plotArray,
        });

        // Updates after both datasets pushed
        if (GDPChart.data.datasets.length === 2) {
          GDPChart.update();
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

  // $('#CHF').ready(function() {
  //   calculateChart('CHF');
  // });

  function calculateChart(currencyId) {
    graphData.plots[currencyId] = Array(23);
    graphData.urlDates[currencyId] = [];
    graphData.labels[currencyId] = [];
    var startFullDate = new Date().toISOString().slice(0, 10);
    var day = startFullDate.substring(8, 10)
    var year = parseInt(startFullDate.substring(0, 4), 10)
    var startMonth = parseInt(startFullDate.substring(5, 7), 10)


    var todayDate = new Date();
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date('2016-06-22');

    // Difference between today and referendum in days
    var diffDays = Math.round(Math.abs((firstDate.getTime() - todayDate.getTime())/(oneDay)));
    // Works out even day interval for 20 rates since referendum
    var dayInterval = Math.round(diffDays/19);

    // Makes todayDate one interval ahead so it returns today's date in the first loop iteration
    todayDate = new Date(todayDate.setDate(todayDate.getDate() + dayInterval))


    for (var i = 0; i < 20; i++) {
      graphData.urlDates[currencyId].unshift(new Date(todayDate.setDate(todayDate.getDate() - dayInterval)).toISOString().slice(0, 10));
    }

    for (var i = 0; i < 20; i++) {
      graphData.labels[currencyId].push(graphData.urlDates[currencyId][i].substring(5, 7) + '-' + graphData.urlDates[currencyId][i].substring(2, 4));
    }

    graphData.urlDates[currencyId][0] = '2016-06-22';

    getRates(currencyId);
  };

  function getRates(currencyId) {

    $.get('js\\json\\chartrates.json', function(data) {
      graphData.plots[currencyId] = data[currencyId];
    }).then(function() {
      if (graphData.plots[currencyId][0] > graphData.plots[currencyId][19]) {
        //var lineColor = '#f73b3b';
        var lineColor = '#8d0011'
        // var gradient = ctx.createLinearGradient(0, 600, 0, 0);
        // gradient.addColorStop(0, 'rgba(226, 77, 77, .8)');
        // gradient.addColorStop(.75, 'rgba(226, 77, 77, 0)');
      } else if (graphData.plots[currencyId][0] < graphData.plots[currencyId][19]) {
        var lineColor = '#4fc64f';
        // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
        // gradient.addColorStop(0, 'rgba(110, 216, 110, .8)');
        // gradient.addColorStop(.75, 'rgba(110, 216, 110, 0)');
      }

      updateChart(currencyId, graphData.labels[currencyId], graphData.plots[currencyId], 'rgba(0, 0, 0, 0)', lineColor, currencyId);
    });
  }


  function updateChart(currencyId, labels, data, gradient, lineColor, currencyId) {
    chart = currencyId + 'Chart';
    eval(chart).data = {
      labels: labels,
      datasets: [{
        label: currencyId,
        pointRadius: 0,
        pointHitRadius: 8,
        backgroundColor: 'rgba(110, 216, 110, 0)',
        borderColor: lineColor,
        data: data,
      }]
    }
    eval(chart).update();
    if (compareIndex === 0) {
      lineColor = '#db2418';
      backgroundColor = 'rgba(249, 41, 27, .2)';
    } else {
      lineColor = '#28AFFA';
      backgroundColor = 'rgba(40,175,250,.2)';
    }
    compareChart.data.labels = labels;
    compareChart.data.datasets.push({
      label: currencyId + ' vs GBP',
      pointRadius: 0,
      pointHitRadius: 8,
      backgroundColor: backgroundColor,
      borderColor: lineColor,
      data: data,
    })
    compareIndex++;
    compareChart.update();
    console.log('Chart updated.')
  }

  var showScales = true;
  var scalesObj = {};

  if (showScales === true) {
    scalesObj = {
      yAxes: [{
        ticks: {
          autoSkip: true,
          maxTicksLimit: 3
        }
      }]
    }
  } else {
    scalesObj = {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    }
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
      scales: scalesObj,
      legend: {
        display: false
      },
    }
  });


  var USDCtx = $('#USDChart')[0].getContext('2d');
  var USDChart = new Chart(USDCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      scales: scalesObj,
      legend: {
        display: false
      },
    }
  });


  /*var CHFCtx = $('#CHFChart')[0].getContext('2d');
  var CHFChart = new Chart(CHFCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      scales: scalesObj,
      legend: {
        display: false
      },
    }
  });*/


  var GDPCtx = $('#GDPChart')[0].getContext('2d');
  var GDPChart = new Chart(GDPCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 3
          }
        }],
        xAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        }]
      },
      legend: {
        display: true
      },
    }
  });

  var compareCtx = $('#compareChart')[0].getContext('2d');
  var compareChart = new Chart(compareCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 4,
            fontColor: '#ccc'
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#ccc'
          }
        }]
      },
      legend: {
        display: true,
        labels: {
          fontColor: '#ccc'
        }
      },
    }
  });


//   var cardHeight;
//   // Sets the height of the back of the card to match the image in front
//   function setBackHeight() {
//     cardHeight = $('.front').css('height');
//     console.log(cardHeight)
//     $('.back .card').css('height', cardHeight);
//     console.log($('.back .card').css('height'))
//   }
//
//   setBackHeight();
//
//   $('.card-parent').addClass('not-flipped');
//   //Swap behavior of hover with click on touch devices
//   $('.card-parent.not-flipped').click(function() {
//     $('.card-parent').addClass('flipped');
//     $(this).removeClass('not-flipped');
//   });
//
//   $('.back').click(function() {
//     console.log('back clicked');
//     $('.card-parent').removeClass('flipped');
//     $('.card-parent').addClass('not-flipped');
//   });
//   if (Modernizr.touch) {
//     $('.card-parent .back').prepend('<div class="cancel-card">\X</div>');
//     $('.card.not-flipped').click(function() {
//       $('.card-parent').addClass('not-flipped');
//       $(this).removeClass('not-flipped');
//     });
//     $('.cancel-card').click(function(ev) {
//       ev.stopPropagation();
//       $('.card-parent').addClass('not-flipped');
//     });
//   } else {
//     $('.card-parent').hover(function() {
//       $(this).toggleClass('not-flipped');
//     });
//   }
//
// });
//
// $(window).load(function() {
//   // On window change, recalculate the size of the box
//   window.onresize = function() {
//     setBackHeight();
//   }
//   setBackHeight();
});
