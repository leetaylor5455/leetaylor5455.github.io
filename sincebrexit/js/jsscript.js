$(document).ready(function() {

  // $('.grid').masonry({
  //   // options
  //   itemSelector: '.grid-item',
  //   columnWidth: '.grid-sizer',
  //   percentPosition: true
  // });

  var ratesNow = {};
  var ratesBefore = {};

  var graphData = {
    plots: {},
    labels: {},
  };

  var twoDArrays = ['USD', 'EUR', 'GDP', 'Inflation'];
  var graphDatasets = ['USD', 'EUR', 'GDP', 'Inflation'];
  var reverseColours = ['Inflation', 'Unemploy'];

  var compareIndex = 0;

  // Date Function
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  function convertDate(d) {

    d = new Date(d);

    var month = monthNames[d.getMonth()];
    var day = d.getDate();
    var dayString = '' + day;
    year = '' + d.getFullYear();


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
    return fullDate;
  }


  function populateRates(id) {
    return new Promise(function(resolve, reject) {
      $.get('js/json/rates.json', function(data) {
        if (twoDArrays.includes(id)) {
          if (id == 'GDP') {
            ratesNow[id] = [data.rates[id][0][0], (data.rates[id][0][1]/1000).toFixed(2)];
          } else {
            ratesNow[id] = [data.rates[id][0][0], data.rates[id][0][1].toFixed(2)];
          }
        } else {
          ratesNow[id] = [data.rates[id][0], data.rates[id][1].toFixed(2)];
        }
      }).then(function() {
        $.get('js/json/ratesbefore.json', function(data) {
          if (twoDArrays.includes(id)) {
            if (id == 'GDP') {
              ratesBefore[id] = [data.rates[id][0][0], (data.rates[id][0][1]/1000).toFixed(2)];
            } else {
              ratesBefore[id] = [data.rates[id][0][0], data.rates[id][0][1].toFixed(2)];
            }
          } else {
            ratesBefore[id] = [data.rates[id][0], data.rates[id][1].toFixed(2)];
          }
        }).then(function() {
          resolve();
        })
      });
    });
  }

  function calculateChart(id) {
    (function(id) {
      $.get('js/json/rates.json', function(data) {
        var chartArray = data.rates[id];
        graphData.plots[id] = Array(chartArray.length-1)
        graphData.labels[id] = Array(chartArray.length-1)
        for (var i = 0; i < chartArray.length; i++) {
          graphData.plots[id][i] = chartArray[i][1];
          graphData.labels[id][i] = chartArray[i][0].substring(5, 7) + '-' + chartArray[i][0].substring(2, 4);
        }
        graphData.plots[id].reverse();
        graphData.labels[id].reverse();
      }).then(function() {
        if (graphData.plots[id][0] < graphData.plots[id][graphData.plots[id].length-1]) {
          if (reverseColours.includes(id)) {
            var lineColor = '#8d0011';
          } else {
            var lineColor = '#2b4d04';
          }

        } else {
          if (reverseColours.includes(id)) {
            var lineColor = '#2b4d04';
          } else {
            var lineColor = '#8d0011';
          }
        }
        pushToChart(graphData.plots[id], graphData.labels[id], lineColor, id);
      });
    })(id);

    function pushToChart(plots, labels, lineColor, id) {
      chart = id + 'Chart';
      eval(chart).data = {
        labels: labels,
        datasets: [{
          label: id,
          pointRadius: 0,
          pointHitRadius: 8,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          borderColor: lineColor,
          data: plots,
        }]
      }
      eval(chart).update();
      console.log('Chart updated.')
    }
  }

  function displayDateNow(id) {
    // console.log('Rates now: ', ratesNow)
    $('#' + id).find('.dateNow').text(convertDate(ratesNow[id][0]));
  }

  function displayDateBefore(id) {
    // console.log('Rates before: ', ratesBefore)
    $('#' + id).find('.dateBefore').text(convertDate(ratesBefore[id][0]));
  }

  // Displays Pp to Date Rates on Card
  function updateRatesNow(id, symbol) {
    var jqueryID = '#' + id + 'Now';
    if (symbol == '% ') {
      $(jqueryID).text(ratesNow[id][1] + symbol);
    } else {
      $(jqueryID).text(symbol + ratesNow[id][1]);
    }

    updateRatesBefore(id, symbol);
  }

  // Displays Previous Rates on Card
  function updateRatesBefore(id, symbol) {
    var jqueryID = '#' + id + 'Before';
    if (symbol == '% ') {
      $(jqueryID).text(ratesBefore[id][1] + symbol);
    } else {
      $(jqueryID).text(symbol + ratesBefore[id][1]);
    }

    updateRatesChange(id, symbol);
  }

  // Displays Rates Change on Card
  function updateRatesChange(id, symbol) {

    var jqueryID = '#' + id + 'Change';
    var indicator = '#' + id + 'Ind'

    var returnedCalc = changeCalc(ratesBefore[id][1], ratesNow[id][1], $('#' + id), symbol);

    $(jqueryID).text(returnedCalc[0]);
    if (returnedCalc[1] == 'up') {
      if (symbol == '% ') {
        $(indicator).attr('src', 'images/arrow-up-red.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #8d0011')
      } else {
        $(indicator).attr('src', 'images/arrow-up-green.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #2b4d04')
      }
    } else {
      if (symbol == '% ') {
        $(indicator).attr('src', 'images/arrow-down-green.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #2b4d04')
      } else {
        $(indicator).attr('src', 'images/arrow-down-red.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #8d0011')
      }
    }
    $(indicator).text(returnedCalc[1]);


    function changeCalc(rateBefore, rateNow, changer, symbol) {
      if (changer.attr('id') == 'FTSE100') {
        var changePercentage = (((rateNow/rateBefore)*100)-100).toFixed(2);
        symbol = ' (' + changePercentage + '%) ';
      }
      if (symbol == '% ') {
        if (rateNow > rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          rateChange = 'UP BY ' + rateChange + symbol + " ▲";
          var change = 'up'
        } else if (rateNow < rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          rateChange = 'DOWN BY ' + rateChange + symbol + " ▼";
          var change = 'down'
        }
      } else {
        if (rateNow < rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          var change = 'down'
          rateChange = 'DOWN BY' + symbol + rateChange + " ▼";

        } else if (rateNow > rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          var change = 'up'
          rateChange = 'UP BY' + symbol + rateChange + " ▲";

        }
      }

      return [rateChange, change];
    }
  }


  function runAll(id, symbol) {
    populateRates(id).then(function() {
      displayDateNow(id);
      displayDateBefore(id);
      updateRatesNow(id, symbol);
      if (graphDatasets.includes(id)) {
        calculateChart(id);
      }
    });

  }

  runAll('USD', ' $');
  runAll('EUR', ' €');
  runAll('GDP', ' $');
  runAll('Unemploy', '% ');
  runAll('Inflation', '% ');
  runAll('FTSE100', ' ');

  // $('#GDP').ready(function() {
  //   graphData.urlDates.GDP = [];
  //   graphData.plots.GDP = [[],[]];
  //
  //   for (var i = 0; i < 20; i++) {
  //     graphData.plots.GDP[0][i] = null;
  //     graphData.plots.GDP[1][i] = null;
  //   }
  //
  //
  //   $.get('js/json/rates.json', function(data) {
  //     var gdpArray = data.rates.GDP;
  //
  //     for (var i = gdpArray.length - 20; i < gdpArray.length; i++) {
  //       graphData.urlDates.GDP.push(gdpArray[i][0]);
  //     }
  //
  //     // So it still works when its 2019, 2020 etc
  //     var yearsSinceBrexit = new Date().getFullYear() - 2016
  //
  //     var beforeBrexitArray = graphData.plots.GDP[0];
  //     for (var i = gdpArray.length - 20; i < gdpArray.length - yearsSinceBrexit; i++) {
  //       // Not sure why it's i-18 but that's what works
  //       beforeBrexitArray[i - 18] = ((gdpArray[i][1])/1000).toFixed(2);
  //     }
  //
  //     var sinceBrexitArray = graphData.plots.GDP[1];
  //     for (var i = gdpArray.length - yearsSinceBrexit - 1; i < gdpArray.length; i++) {
  //       sinceBrexitArray[i - 18] = ((gdpArray[i][1])/1000).toFixed(2);
  //     }
  //
  //     // Clears datasets so that they don't build up for each click
  //     GDPChart.data.datasets = []
  //     for (var i = 0; i < graphData.urlDates.GDP.length; i++) {
  //       GDPChart.data.labels.push(parseInt(graphData.urlDates.GDP[i].substring(0, 4), 10) + 1)
  //     }
  //     //GDPChart.data.labels = graphData.urlDates.GDP
  //
  //     updateGDP(beforeBrexitArray, graphData.urlDates.GDP, 'Before Ref.')
  //     updateGDP(sinceBrexitArray, graphData.urlDates.GDP, 'Since Ref.')
  //
  //     function updateGDP(plotArray, labelArray, label) {
  //       //if (chart.data.datasets.length <= 1) {
  //       if (plotArray[0] < plotArray[plotArray.length - 1]) {
  //         var lineColor = '#8d0011'
  //         // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
  //         // gradient.addColorStop(0, 'rgba(226, 77, 77, .8)');
  //         // gradient.addColorStop(.75, 'rgba(226, 77, 77, 0)');
  //       } else if (plotArray[0] > plotArray[plotArray.length - 1]) {
  //         var lineColor = '#0caf19';
  //         // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
  //         // gradient.addColorStop(0, 'rgba(110, 216, 110, .8)');
  //         // gradient.addColorStop(.75, 'rgba(110, 216, 110, 0)');
  //       }
  //
  //       GDPChart.data.datasets.push({
  //         label: label,
  //         pointRadius: 0,
  //         pointHitRadius: 8,
  //         backgroundColor: 'rgba(0, 0, 0, 0)',
  //         borderColor: lineColor,
  //         data: plotArray,
  //       });
  //
  //       // Updates after both datasets pushed
  //       if (GDPChart.data.datasets.length === 2) {
  //         GDPChart.update();
  //         console.log('Chart updated.');
  //       }
  //
  //
  //     }
  //   });
  // });

  // function FTSEChart() {
  //   $.get('js/json/stockrates.json', function(data) {
  //     graphData.plots.FTSE = [];
  //     graphData.labels.FTSE = [];
  //     for (var i = 0; i < data.rates.FTSE100.length-1; i++) {
  //       graphData.plots.FTSE.unshift(data.rates.FTSE100[i].close);
  //       graphData.labels.FTSE.unshift(data.rates.FTSE100[i].date.substring(5, 7) + '-' + data.rates.FTSE100[i].date.substring(2, 4));
  //     }
  //   }).then(function() {
  //     // graphData.plots.FTSE[0] = 6261.20;
  //     // graphData.plots.FTSE[graphData.plots.FTSE.length-1] = rates.FTSE100Now;
  //     // graphData.labels.FTSE[0] = 'Ref.'
  //     // graphData.labels.FTSE[graphData.labels.FTSE.length-1] = 'Today'
  //     if (graphData.plots.FTSE[graphData.plots.FTSE.length-1] > graphData.plots.FTSE[0]) {
  //       var lineColor = '#2b4d04';
  //     } else {
  //       var lineColor = '#8d0011'
  //     }
  //     FTSEChart.data = {
  //       labels: graphData.labels.FTSE,
  //       datasets: [{
  //         label: 'Monthly Values Since Ref.',
  //         pointRadius: 0,
  //         pointHitRadius: 3,
  //         backgroundColor: 'rgba(110, 216, 110, 0)',
  //         borderColor: lineColor,
  //         data: graphData.plots.FTSE,
  //       }]
  //     }
  //     FTSEChart.update();
  //     console.log('Chart updated.');
  //   });
  // }

  // function InflationChart() {
  //   $.get('js/json/rates.json', function(data) {
  //     graphData.plots.Inflation = [];
  //     graphData.labels.Inflation = [];
  //     for (var i = 0; i < data.rates.Inflation.length-1; i++) {
  //       graphData.plots.Inflation.unshift(data.rates.Inflation[i][1]);
  //       graphData.labels.Inflation.unshift(data.rates.Inflation[i][0].substring(5, 7) + '-' + data.rates.Inflation[i][0].substring(2, 4));
  //     }
  //   }).then(function() {
  //     if (graphData.plots.Inflation[graphData.plots.Inflation.length-1] < graphData.plots.Inflation[0]) {
  //       var lineColor = '#2b4d04';
  //     } else {
  //       var lineColor = '#8d0011'
  //     }
  //     InflationChart.data = {
  //       labels: graphData.labels.Inflation,
  //       datasets: [{
  //         label: 'Monthly Values Since Ref.',
  //         pointRadius: 0,
  //         pointHitRadius: 8,
  //         backgroundColor: 'rgba(110, 216, 110, 0)',
  //         borderColor: lineColor,
  //         data: graphData.plots.Inflation,
  //       }]
  //     }
  //     InflationChart.update();
  //     console.log('Chart updated.')
  //   });
  // }

  // InflationChart();
  // FTSEChart();

  // $('#EUR').ready(function() {
  //   calculateChart('EUR');
  // });
  //
  // $('#USD').ready(function() {
  //   calculateChart('USD');
  // });
  //
  // // $('#CHF').ready(function() {
  // //   calculateChart('CHF');
  // // });
  //
  // function calculateChart(currencyId) {
  //   graphData.plots[currencyId] = Array(20);
  //   graphData.urlDates[currencyId] = [];
  //   graphData.labels[currencyId] = Array(20);
  //   var startFullDate = new Date().toISOString().slice(0, 10);
  //   var day = startFullDate.substring(8, 10)
  //   var year = parseInt(startFullDate.substring(0, 4), 10)
  //   var startMonth = parseInt(startFullDate.substring(5, 7), 10)
  //
  //
  //   var todayDate = new Date();
  //   var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  //   var firstDate = new Date('2016-06-22');
  //
  //   // Difference between today and referendum in days
  //   var diffDays = Math.round(Math.abs((firstDate.getTime() - todayDate.getTime())/(oneDay)));
  //   // Works out even day interval for 20 rates since referendum
  //   var dayInterval = Math.round(diffDays/19);
  //
  //   // Makes todayDate one interval ahead so it returns today's date in the first loop iteration
  //   todayDate = new Date(todayDate.setDate(todayDate.getDate() + dayInterval))
  //
  //
  //   for (var i = 0; i < 20; i++) {
  //     graphData.urlDates[currencyId].unshift(new Date(todayDate.setDate(todayDate.getDate() - dayInterval)).toISOString().slice(0, 10));
  //   }
  //   graphData.labels[currencyId][0] = 'Ref.';
  //   graphData.labels[currencyId][19] = 'Today'
  //
  //   for (var i = 1; i < 19; i++) {
  //     graphData.labels[currencyId][i] = (graphData.urlDates[currencyId][i].substring(5, 7) + '-' + graphData.urlDates[currencyId][i].substring(2, 4));
  //   }
  //
  //   graphData.urlDates[currencyId][0] = '2016-06-22';
  //
  //   getRates(currencyId);
  // };
  //
  // function getRates(currencyId) {
  //
  //   $.get('js/json/rates.json', function(data) {
  //     graphData.plots[currencyId] = data.rates[currencyId];
  //   }).then(function() {
  //     if (graphData.plots[currencyId][0] > graphData.plots[currencyId][19]) {
  //       //var lineColor = '#f73b3b';
  //       var lineColor = '#8d0011'
  //       // var gradient = ctx.createLinearGradient(0, 600, 0, 0);
  //       // gradient.addColorStop(0, 'rgba(226, 77, 77, .8)');
  //       // gradient.addColorStop(.75, 'rgba(226, 77, 77, 0)');
  //     } else if (graphData.plots[currencyId][0] < graphData.plots[currencyId][19]) {
  //       var lineColor = '#4fc64f';
  //       // var gradient = ctx.createLinearGradient(0, 0, 0, 600);
  //       // gradient.addColorStop(0, 'rgba(110, 216, 110, .8)');
  //       // gradient.addColorStop(.75, 'rgba(110, 216, 110, 0)');
  //     }
  //
  //     updateChart(currencyId, graphData.labels[currencyId], graphData.plots[currencyId], lineColor, currencyId);
  //   });
  // }
  //
  //
  // function updateChart(currencyId, labels, data, lineColor, currencyId) {
  //   chart = currencyId + 'Chart';
  //   eval(chart).data = {
  //     labels: labels,
  //     datasets: [{
  //       label: currencyId,
  //       pointRadius: 0,
  //       pointHitRadius: 8,
  //       backgroundColor: 'rgba(110, 216, 110, 0)',
  //       borderColor: lineColor,
  //       data: data,
  //     }]
  //   }
  //   eval(chart).update();
  //   if (compareIndex === 0) {
  //     lineColor = '#db2418';
  //     backgroundColor = 'rgba(249, 41, 27, .2)';
  //   } else {
  //     lineColor = '#28AFFA';
  //     backgroundColor = 'rgba(40,175,250,.2)';
  //   }
  //   compareChart.data.labels = labels;
  //   compareChart.data.datasets.push({
  //     label: currencyId + ' vs GBP',
  //     pointRadius: 0,
  //     pointHitRadius: 8,
  //     backgroundColor: backgroundColor,
  //     borderColor: lineColor,
  //     data: data,
  //   })
  //   compareIndex++;
  //   compareChart.update();
  //   console.log('Chart updated.')
  // }

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


  var FTSECtx = $('#FTSEChart')[0].getContext('2d');
  var FTSEChart = new Chart(FTSECtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      scales: scalesObj,
      legend: {
        display: false,
      },
    }
  });

  var InflationCtx = $('#InflationChart')[0].getContext('2d');
  var InflationChart = new Chart(InflationCtx, {

    type: 'line',

    options: {
      elements: {
        line: {
          tension: .2,
        }
      },
      scales: scalesObj,
      legend: {
        display: false,
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
