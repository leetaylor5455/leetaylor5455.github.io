$(document).ready(function() {

  var ratesNow = {};
  var ratesBefore = {};
  var compareUpdated = false;

  var graphData = {
    plots: {},
    labels: {}
  };

  var charts = {
    ctx: {},
    chart: {}
  };

  // For easy expansion of cards
  const twoDDatasets = ['USD', 'EUR', 'GDP', 'Inflation', 'Unemploy', 'Employ'];
  const graphDatasets = ['USD', 'EUR', 'GDP', 'Inflation', 'FTSE100', 'FTSE250', 'Unemploy', 'Employ'];
  const reverseRates = ['Inflation', 'Unemploy'];
  const stockRates = ['FTSE100', 'FTSE250'];
  const dailyCharts = ['USD', 'EUR'];
  const splitDatasets = ['GDP'];

  // To be used in convertDate Function
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  /**
   * @param {string} d date in ISOString Format
   * @returns {string} date in 'dd(th) mmm yyyy' format
   */
  function convertDate(d, condense = false) {

    if (condense) {
      var condensed = d.substring(5, 7) + '-' + d.substring(2, 4);
      return condensed;
    }

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
   * @returns {promise} resolved when rates object populated
   */
  function populateRates(id) {
    return new Promise(function(resolve, reject) {
      $.get('js/json/rates.json', function(data) {
        if (twoDDatasets.includes(id)) {
          ratesNow[id] = [data.rates[id][0][0], data.rates[id][0][1].toFixed(2)];
        } else {
          ratesNow[id] = [data.rates[id][0], data.rates[id][1].toFixed(2)];
        }
      }).then(function() {
        $.get('js/json/ratesbefore.json', function(data) {
          if (twoDDatasets.includes(id)) {
            ratesBefore[id] = [data.rates[id][0][0], data.rates[id][0][1].toFixed(2)];
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
            graphData.labels[id].unshift(convertDate(data.rates[id][i].date, true))
          }
        }).then(function() {
          if (graphData.plots[id][graphData.plots[id].length - 1] > graphData.plots[id][0]) {
            var grd = charts.ctx[id].createLinearGradient(0, 0, 0, 180);
            grd.addColorStop(0, 'rgba(119, 214, 10, 0.6)');
            grd.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
            var lineColor = '#2b4d04';
          } else {
            var grd = charts.ctx[id].createLinearGradient(0, 180, 0, 0);
            grd.addColorStop(0, 'rgba(221, 0, 26, 0.9)');
            grd.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
            var lineColor = '#8d0011';
          }

          pushToChart(graphData.plots[id], graphData.labels[id], lineColor, id, grd, 'Weekly Vals Since Ref.', 2, 2);
        });
      };

      /**
       * @param {string} id rate selector to access rates object
       */
      (function(id) {
        $.get('js/json/rates.json', function(data) {
          var chartArray = data.rates[id];
          // Creates split array so they can be coloured separately
          if (splitDatasets.includes(id)) {
            graphData.plots[id] = [[],[]];
            graphData.labels[id] = [];
            var i = data.rates[id].length-1;
            while (Date.parse(data.rates[id][i][0]) < Date.parse('2016-06-22')) {
              graphData.plots[id][0].push(data.rates[id][i][1]);
              graphData.labels[id].push(convertDate(data.rates[id][i][0], true));
              i--;
            }
            while (i >= 0) {
              graphData.plots[id][1].push(data.rates[id][i][1]);
              graphData.labels[id].push(convertDate(data.rates[id][i][0], true));
              i--;
            }

            var splitTwoLength = graphData.plots[id][1].length;
            var splitOneLength = graphData.plots[id][0].length;

            for (var j = 0; j < splitTwoLength; j++) {
              graphData.plots[id][0].push(null);
            }

            graphData.plots[id][1].unshift(graphData.plots[id][0][graphData.plots[id][0].length-1-splitTwoLength]);

            for (var k = 0; k < splitOneLength-1; k++) {
              graphData.plots[id][1].unshift(null);
            }

          } else {
            graphData.plots[id] = Array(chartArray.length - 1);
            graphData.labels[id] = Array(chartArray.length - 1);
            for (var i = 0; i < chartArray.length; i++) {
              graphData.plots[id][i] = chartArray[i][1];
              graphData.labels[id][i] = chartArray[i][0].substring(5, 7) + '-' + chartArray[i][0].substring(2, 4);
            }
            // Replaces first and last labels for clarity
            if (dailyCharts.includes(id)) {
              graphData.labels[id][0] = 'Today'
              graphData.labels[id][graphData.labels[id].length-1] = 'Ref.'
            }
            graphData.plots[id].reverse();
            graphData.labels[id].reverse();
          }

        }).then(function() {
          if (splitDatasets.includes(id)) {
            var datasetOne = renderColours(graphData.plots[id][0], id);
            var datasetTwo = renderColours(graphData.plots[id][1], id);
            charts.chart[id].data = {
              labels: graphData.labels[id],
              datasets: [{
                label: 'GDP Up to Ref.',
                pointRadius: 0,
                borderWidth: 2.5,
                pointHitRadius: 5,
                backgroundColor: datasetTwo[4],
                borderColor: datasetTwo[2],
                data: datasetOne[0],
              },
              {
                label: 'GDP Since Ref.',
                pointRadius: 0,
                borderWidth: 2.5,
                pointHitRadius: 5,
                backgroundColor: datasetOne[4],
                borderColor: datasetOne[2],
                data: datasetTwo[0],
              }]
            }
            charts.chart[id].update();
            resolve();
          } else {
            var params = renderColours(graphData.plots[id], id);
            resolve(pushToChart(params[0], params[1], params[2], params[3], params[4]));
          }

          function renderColours(plotArray, id) {
            // If rate has risen
            if (plotArray[0] < plotArray[plotArray.length - 1]) {
              if (reverseRates.includes(id)) {
                // Is bad percentage rate
                var lineColor = '#8d0011';
                var grd = charts.ctx[id].createLinearGradient(0, 0, 0, 150);
                grd.addColorStop(0, 'rgba(221, 0, 26, 0.6)');
                grd.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
              } else {
                // Is good non-percentage rate
                var lineColor = '#2b4d04';
                var grd = charts.ctx[id].createLinearGradient(0, 0, 0, 150);
                grd.addColorStop(0, 'rgba(119, 214, 10, 0.6)');
                grd.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
              }
              // If Rate has fallen
            } else {
              if (reverseRates.includes(id)) {
                // Is good percentage rate
                var lineColor = '#2b4d04';
                var grd = charts.ctx[id].createLinearGradient(0, 0, 0, 150);
                grd.addColorStop(0, 'rgba(119, 214, 10, 0.6)');
                grd.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
              } else {
                // Is bad non-percentage rate
                var grd = charts.ctx[id].createLinearGradient(0, 0, 0, 150);
                grd.addColorStop(0, 'rgba(221, 0, 26, 0.6)');
                grd.addColorStop(0.75, 'rgba(255, 255, 255, 0.1)');
                var lineColor = '#8d0011';
              }
            }
            return [plotArray, graphData.labels[id], lineColor, id, grd];
          }

        });
      })(id);

      /**
       * @param {array<float>} plots chart values
       * @param {array<string>} labels condensed date for timescale
       * @param {string} lineColor hex color value used to paint line
       * @param {string} id used to reference specific chart object
       * @param {gradient} backgroundColor gradient for visual touch
       * @param {string} legend for graph titling (if specified, otherwise null)
       * @param {float} borderWidth the width of the graph line
       * @param {float} pointHitRadius the precision needed to trigger a plot label
       */
      function pushToChart(plots, labels, lineColor, id, backgroundColor, legend = null, borderWidth = 2.5, pointHitRadius = 6) {
        charts.chart[id].data = {
          labels: labels,
          datasets: [{
            label: legend,
            pointRadius: 0,
            borderWidth: borderWidth,
            pointHitRadius: pointHitRadius,
            backgroundColor: backgroundColor,
            borderColor: lineColor,
            data: plots,
          }]
        }
        charts.chart[id].update();
      }
    }).then(function() {
      if (compareUpdated === false) {
        compareChart.data = {
          labels: graphData.labels.EUR,
          datasets: [{
              label: 'GBP vs EUR',
              pointRadius: 0,
              pointHitRadius: 8,
              borderWidth: 2.5,
              // backgroundColor: 'rgba(219, 36, 24, .2)',
              backgroundColor: 'rgba(255, 255, 255, .15)',
              borderColor: '#f0f0f0',
              data: graphData.plots.EUR
            },
            {
              label: 'GBP vs USD',
              pointRadius: 0,
              pointHitRadius: 8,
              borderWidth: 2.5,
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
    var $rateNow = $('#' + id).find('.rate-now')
    var $rateBefore = $('#' + id).find('.rate-before')

    if (symbol === '% ') {
      $rateNow.text(ratesNow[id][1] + symbol);
    } else {
      $rateNow.text(symbol + ratesNow[id][1]);
    }

    if (symbol === '% ') {
      $rateBefore.text(ratesBefore[id][1] + symbol);
    } else {
      $rateBefore.text(symbol + ratesBefore[id][1]);
    }

    updateRatesChange(id, symbol);
  }

  /**
   * @param {string} id to reference html element and rates object
   * @param {string} symbol to be placed in string output
   */
  function updateRatesChange(id, symbol) {

    var $change = $('#' + id).find('.rate-change')
    var $indicator = $('#' + id).find('.indicator')

    var returnedCalc = changeCalc(ratesBefore[id][1], ratesNow[id][1], $('#' + id), symbol);

    $change.text(returnedCalc[0]);

    if (returnedCalc[1] === 'up') {
      if (reverseRates.includes(id)) {
        $indicator.attr('src', 'images/arrow-up-red.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #8d0011');
      } else {
        $indicator.attr('src', 'images/arrow-up-green.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #2b4d04');
      }
    } else {
      if (reverseRates.includes(id)) {
        $indicator.attr('src', 'images/arrow-down-green.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-green.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #2b4d04');
      } else {
        $indicator.attr('src', 'images/arrow-down-red.svg');
        $('#' + id).find('.source-link').attr('src', 'images/external-link-symbol-red.svg');
        // Change column split colour
        $('#' + id).find('.card-split').attr('style', 'border-right: 1px solid #8d0011');
      }
    }

    $indicator.text(returnedCalc[1]);

    /**
     * @param {int} rateBefore rate before referendum
     * @param {int} rateNow most up to date value
     * @param {obj} $changer jQuery object used to extract and implant data
     * @param {string} symbol to be placed in string output
     */
    function changeCalc(rateBefore, rateNow, $changer, symbol) {
      if (stockRates.includes($changer.attr('id'))) {
        var changePercentage = (((rateNow / rateBefore) * 100) - 100).toFixed(2);
        symbol = ' (' + changePercentage + '%) ';
      }
      if (symbol === '% ') {
        if (rateNow > rateBefore) {
          // Some percentage rates aren't reversed so must be accounted for
          if (reverseRates.includes($changer.attr('id'))) {
            $changer.addClass('rate-down');
          } else {
            $changer.addClass('rate-up');
          }
          var rateChange = (rateNow - rateBefore).toFixed(2);
          rateChange = 'UP BY ' + rateChange + symbol + " ▲";
          var change = 'up';

        } else if (rateNow < rateBefore) {
          if (reverseRates.includes($changer.attr('id'))) {
            $changer.addClass('rate-up');
          } else {
            $changer.addClass('rate-down');
          }
          var rateChange = (rateBefore - rateNow).toFixed(2);
          rateChange = 'DOWN BY ' + rateChange + symbol + " ▼";
          var change = 'down';
        }
      } else {
        if (rateNow < rateBefore) {
          $changer.addClass('rate-down');
          var rateChange = (rateBefore - rateNow).toFixed(2);
          var change = 'down';
          rateChange = 'DOWN BY' + symbol + rateChange + " ▼";

        } else if (rateNow > rateBefore) {
          $changer.addClass('rate-up');
          var rateChange = (rateNow - rateBefore).toFixed(2);
          var change = 'up';
          rateChange = 'UP BY' + symbol + rateChange + " ▲";

        }
      }

      return [rateChange, change];
    }
  }

  /**
   * @param {string} id indicator identification
   */
  function declareChart(id) {
    var $chartCanvas = $('#' + id).find('.chart');
    let legendObj;
    if (id === 'GDP') {
      legendObj = {
        display: true
      }
    } else {
      legendObj = {
        display: false
      }
    }

    charts.ctx[id] = $chartCanvas[0].getContext('2d');
    charts.chart[id] = new Chart(charts.ctx[id], {

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
              maxTicksLimit: 5
            }
          }]
        },
        legend: legendObj,
      }
    });
  }

  /**
   * @param {string} id to be passed into function calls
   * @param {string} symbol to be passed into function calls
   */
  function runAll(id, symbol = '') {
    declareChart(id);
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
  runAll('FTSE100');
  runAll('FTSE250');
  runAll('Employ', '% ')


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

});
