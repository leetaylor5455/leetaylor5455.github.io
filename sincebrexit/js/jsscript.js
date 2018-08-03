$(document).ready(function() {

  var rates = {};

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
  function updateRatesNow() {
    $.get("js\\rates.json", function(returnedVals) {
      rates.EURRateNow = returnedVals.rates.EUR.toFixed(2);
      rates.USDRateNow = returnedVals.rates.USD.toFixed(2);
      rates.CHFRateNow = returnedVals.rates.CHF.toFixed(2);
      rates.GDPNow = ((returnedVals.rates.GDP)/1000).toFixed(2);
      rates.unemployNow = (((returnedVals.rates.Unemployment/1000)/35)*100).toFixed(2);
      console.log("EUR Rate: ", rates.EURRateNow);
      console.log("USD Rate: ", rates.USDRateNow);
      console.log("CHF Rate: ", rates.CHFRateNow);
      console.log("UK GDP: ", rates.GDPNow);
      console.log("Unemployment now: ", rates.unemployNow);

      $('#EURRateNow').text("€" + rates.EURRateNow);
      $('#USDRateNow').text("$" + rates.USDRateNow);
      $('#CHFRateNow').text("₣" + rates.CHFRateNow);
      $('#GDPNow').text("$" + rates.GDPNow);
      $('#UnemployNow').text(rates.unemployNow + "%");
      updateRatesChange();
    });
  }

  function updateRatesBefore() {
    $.get("js\\ratesbefore.json", function(returnedVals) {
      rates.EURRateBefore = returnedVals.rates.EUR.toFixed(2);
      rates.USDRateBefore = returnedVals.rates.USD.toFixed(2);
      rates.CHFRateBefore = returnedVals.rates.CHF.toFixed(2);
      rates.GDPBefore = ((returnedVals.rates.GDP)/1000).toFixed(2);
      rates.unemployBefore = (((returnedVals.rates.Unemployment/1000)/35)*100).toFixed(2);

      $('#EURRateBefore').text("€" + rates.EURRateBefore);
      $('#USDRateBefore').text("$" + rates.USDRateBefore);
      $('#CHFRateBefore').text("₣" + rates.CHFRateBefore)
      $('#GDPBefore').text("$" + rates.GDPBefore);
      $('#UnemployBefore').text(rates.unemployBefore + "%");
    });
  }

  function updateRatesChange() {

    // $('#EURRateChange').text(changeCalc(parseFloat(rates.EURRateBefore), parseFloat(rates.EURRateNow), $('#EURvsGBP'), ' €'));
    // $('#USDRateChange').text(changeCalc(parseFloat(rates.USDRateBefore), parseFloat(rates.USDRateNow), $('#USDvsGBP'), ' $'));
    // $('#CHFRateChange').text(changeCalc(parseFloat(rates.CHFRateBefore), parseFloat(rates.CHFRateNow), $('#CHFvsGBP'), ' ₣'));
    // $('#GDPChange').text(changeCalc(parseFloat(rates.GDPBefore), parseFloat(rates.GDPNow), $('#GDP'), ' $'));
    // $('#UnemployChange').text(changeCalc(parseFloat(rates.unemployBefore)*-1, parseFloat(rates.unemployNow)*-1, $('#Unemploy'), '% '));
    console.log('EUR Rate Before: ', rates.EURRateBefore)

    $('#EURRateChange').text(changeCalc(rates.EURRateBefore, rates.EURRateNow, $('#EURvsGBP'), ' €'));
    $('#USDRateChange').text(changeCalc(rates.USDRateBefore, rates.USDRateNow, $('#USDvsGBP'), ' $'));
    $('#CHFRateChange').text(changeCalc(rates.CHFRateBefore, rates.CHFRateNow, $('#CHFvsGBP'), ' ₣'));
    $('#GDPChange').text(changeCalc(rates.GDPBefore, rates.GDPNow, $('#GDP'), ' $'));
    $('#UnemployChange').text(changeCalc(rates.unemployBefore*-1, rates.unemployNow*-1, $('#Unemploy'), '% '));

    function changeCalc(rateBefore, rateNow, changer, symbol) {
      //console.log(rateBefore)
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
      return rateChange;
    }
  }

  updateRatesNow();
  updateRatesBefore();



});
