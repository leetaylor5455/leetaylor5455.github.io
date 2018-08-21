$(document).ready(function() {

  var ratesNow = {};
  var ratesBefore = {};
  var compareUpdated = false;

  var graphData = {
    plots: {},
    labels: {}
  };

  // For easy expansion of cards
  var twoDDatasets = ['USD', 'EUR', 'GDP', 'Inflation'];
  var graphDatasets = ['USD', 'EUR', 'GDP', 'Inflation', 'FTSE100', 'FTSE250'];
  var reverseColours = ['Inflation', 'Unemploy'];
  var stockRates = ['FTSE100', 'FTSE250'];

  // To be used in convertDate Function
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  /**
   * @param {string} d date in ISOString Format
   * @returns {string} date in 'dd(th) mmm yyyy' format
   */
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

  /**
   * @param {string} id rate selector to assign and identify rates
   * @returns {promise} rates object populated
   */
  function populateRates(id) {
    return new Promise(function(resolve, reject) {
      $.get('js/json/rates.json', function(data) {
        if (twoDDatasets.includes(id)) {
          if (id == 'GDP') {
            ratesNow[id] = [data.rates[id][0][0], (data.rates[id][0][1] / 1000).toFixed(2)];
          } else {
            ratesNow[id] = [data.rates[id][0][0], data.rates[id][0][1].toFixed(2)];
          }
        } else {
          ratesNow[id] = [data.rates[id][0], data.rates[id][1].toFixed(2)];
        }
      }).then(function() {
        $.get('js/json/ratesbefore.json', function(data) {
          if (twoDDatasets.includes(id)) {
            if (id == 'GDP') {
              ratesBefore[id] = [data.rates[id][0][0], (data.rates[id][0][1] / 1000).toFixed(2)];
            } else {
              ratesBefore[id] = [data.rates[id][0][0], data.rates[id][0][1].toFixed(2)];
            }
          } else {
            ratesBefore[id] = [data.rates[id][0], data.rates[id][1].toFixed(2)];
          }
        }).then(function() {
          resolve();
        });
      });
    });
  }

  /**
   * @param {string} id rate selector to assign and identify rates
   * @returns {promise} charts populated
   */
  function calculateChart(id) {
    return new Promise(function(resolve, reject) {
      // Redirects to Bespoke Function for stock rate charts due to different .json file
      if (stockRates.includes(id)) {
        FTSEChart(id);
        return;
      }

      /**
       * @param {string} id rate selector to assign and identify rates
       */
      function FTSEChart(id) {
        $.get('js/json/stockrates.json', function(data) {
          graphData.plots[id] = [];
          graphData.labels[id] = [];
          for (var i = 0; i < data.rates[id].length - 1; i++) {
            graphData.plots[id].unshift(data.rates[id][i].close);
            graphData.labels[id].unshift(data.rates[id][i].date.substring(5, 7) + '-' + data.rates[id][i].date.substring(2, 4));
          }
        }).then(function() {
          if (graphData.plots[id][graphData.plots[id].length - 1] > graphData.plots[id][0]) {
            var lineColor = '#2b4d04';
          } else {
            var lineColor = '#8d0011';
          }

          pushToChart(graphData.plots[id], graphData.labels[id], lineColor, id, 'Weekly Vals Since Ref.');
        });
      }

      /**
       * @param {string} id rate selector to access rates object
       */
      (function(id) {
        $.get('js/json/rates.json', function(data) {
          var chartArray = data.rates[id];
          graphData.plots[id] = Array(chartArray.length - 1);
          graphData.labels[id] = Array(chartArray.length - 1);
          for (var i = 0; i < chartArray.length; i++) {
            graphData.plots[id][i] = chartArray[i][1];
            graphData.labels[id][i] = chartArray[i][0].substring(5, 7) + '-' + chartArray[i][0].substring(2, 4);
          }
          graphData.plots[id].reverse();
          graphData.labels[id].reverse();
        }).then(function() {
          if (graphData.plots[id][0] < graphData.plots[id][graphData.plots[id].length - 1]) {
            // Percentage rates like unemployment are better when lower - so colour indication is reversed
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
          resolve(pushToChart(graphData.plots[id], graphData.labels[id], lineColor, id));
        });
      })(id);

      /**
       * @param {array<float>} plots chart values
       * @param {array<string>} labels condensed date for timescale
       * @param {string} lineColor hex color value used to paint line
       * @param {string} id used to reference specific chart object
       * @param {string} legend for graph titling (if specified, otherwise null)
       */
      function pushToChart(plots, labels, lineColor, id, legend = null) {
        var chart = id + 'Chart';
        eval(chart).data = {
          labels: labels,
          datasets: [{
            label: legend,
            pointRadius: 0,
            pointHitRadius: 8,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: lineColor,
            data: plots,
          }]
        }
        eval(chart).update();
      }
    }).then(function() {
      if (compareUpdated === false) {
        compareChart.data = {
          labels: graphData.labels.EUR,
          datasets: [{
              label: 'GBP vs EUR',
              pointRadius: 0,
              pointHitRadius: 8,
              backgroundColor: 'rgba(219, 36, 24, .2)',
              borderColor: '#db2418',
              data: graphData.plots.EUR
            },
            {
              label: 'GBP vs USD',
              pointRadius: 0,
              pointHitRadius: 8,
              backgroundColor: 'rgba(40, 175, 250, .2)',
              borderColor: '#28affa',
              data: graphData.plots.USD
            }
          ]
        }
        compareChart.update();
        compareUpdated = true;
      }
    });
  }

  /**
   * @param {string} id to reference html element and rates object
   */
  function displayDates(id) {
    $('#' + id).find('.dateNow').text(convertDate(ratesNow[id][0]));
    $('#' + id).find('.dateBefore').text(convertDate(ratesBefore[id][0]));
  }

  /**
   * @param {string} id to reference html element and rates object
   * @param {string} symbol to be placed in string output
   */
  function displayRates(id, symbol) {
    var nowId = '#' + id + 'Now';
    var beforeId = '#' + id + 'Before';

    if (symbol == '% ') {
      $(nowId).text(ratesNow[id][1] + symbol);
    } else {
      $(nowId).text(symbol + ratesNow[id][1]);
    }

    if (symbol == '% ') {
      $(beforeId).text(ratesBefore[id][1] + symbol);
    } else {
      $(beforeId).text(symbol + ratesBefore[id][1]);
    }

    updateRatesChange(id, symbol);
  }

  /**
   * @param {string} id to reference html element and rates object
   * @param {string} symbol to be placed in string output
   */
  function updateRatesChange(id, symbol) {

    var jqueryId = '#' + id + 'Change';
    var indicator = '#' + id + 'Ind';

    var returnedCalc = changeCalc(ratesBefore[id][1], ratesNow[id][1], $('#' + id), symbol);

    $(jqueryId).text(returnedCalc[0]);

    if (returnedCalc[1] == 'up') {
      if (reverseColours.includes(id)) {
        $(indicator).attr('src', 'images/arrow-up-red.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #8d0011');
      } else {
        $(indicator).attr('src', 'images/arrow-up-green.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #2b4d04');
      }
    } else {
      if (reverseColours.includes(id)) {
        $(indicator).attr('src', 'images/arrow-down-green.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #2b4d04');
      } else {
        $(indicator).attr('src', 'images/arrow-down-red.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #8d0011');
      }
    }

    $(indicator).text(returnedCalc[1]);

    /**
     * @param {int} rateBefore rate before referendum
     * @param {int} rateNow most up to date value
     * @param {obj} changer jQuery object used to extract and implant data
     * @param {string} symbol to be placed in string output
     */
    function changeCalc(rateBefore, rateNow, changer, symbol) {
      if (stockRates.includes(changer.attr('id'))) {
        var changePercentage = (((rateNow / rateBefore) * 100) - 100).toFixed(2);
        symbol = ' (' + changePercentage + '%) ';
      }
      if (symbol == '% ') {
        if (rateNow > rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          rateChange = 'UP BY ' + rateChange + symbol + " ▲";
          var change = 'up';
        } else if (rateNow < rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          rateChange = 'DOWN BY ' + rateChange + symbol + " ▼";
          var change = 'down';
        }
      } else {
        if (rateNow < rateBefore) {
          changer.addClass('rate-down');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          var change = 'down';
          rateChange = 'DOWN BY' + symbol + rateChange + " ▼";

        } else if (rateNow > rateBefore) {
          changer.addClass('rate-up');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          var change = 'up';
          rateChange = 'UP BY' + symbol + rateChange + " ▲";

        }
      }

      return [rateChange, change];
    }
  }

  /**
   * @param {string} id to be passed into function calls
   * @param {string} symbol to be passed into function calls
   */
  function runAll(id, symbol) {
    populateRates(id).then(function() {
      displayDates(id);
      displayRates(id, symbol);
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
  runAll('FTSE250', ' ');

  // Allows quick changing of scales in testing
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

  // Chart declarations
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

  var GDPCtx = $('#GDPChart')[0].getContext('2d');
  var GDPChart = new Chart(GDPCtx, {

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

  var FTSE100Ctx = $('#FTSE100Chart')[0].getContext('2d');
  var FTSE100Chart = new Chart(FTSE100Ctx, {

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

  var FTSE250Ctx = $('#FTSE250Chart')[0].getContext('2d');
  var FTSE250Chart = new Chart(FTSE250Ctx, {

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

});
