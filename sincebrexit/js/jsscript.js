$(document).ready(function() {
  // Retreive Newest GBP Values
  $.get("https://exchangeratesapi.io/api/latest?base=GBP", function(rateReturn) {
    var EURRateNow = rateReturn.rates.EUR.toFixed(2);
    var USDRateNow = rateReturn.rates.USD.toFixed(2);
    console.log("EUR Rate: ", EURRateNow);
    console.log("USD Rate: ", USDRateNow);

    var EURRateBefore = 1.3022020236;
    var USDRateBefore = 1.4692745433;

    $('#EURRateNow').text("€" + EURRateNow);
    $('#EURRateBefore').text("€" + EURRateBefore.toFixed(2));

    $('#USDRateNow').text("$" + USDRateNow);
    $('#USDRateBefore').text("$" + USDRateBefore.toFixed(2));

    let EURRateChange;
    let USDRateChange;

    $('#EURRateChange').text(rateChange(EURRateBefore, EURRateNow, $('#EURvsGBP'), ' €'));
    $('#USDRateChange').text(rateChange(USDRateBefore, USDRateNow, $('#USDvsGBP'), ' $'));

    function rateChange(rateBefore, rateNow, changer, currency) {
      if (rateNow < rateBefore) {
        changer.addClass('rate-down');
        var rateChange = (rateBefore - rateNow).toFixed(2);
        rateChange = 'DOWN BY' + currency + rateChange + " ▼";
      } else if (rateNow > rateBefore) {
        changer.addClass('rate-up');
        var rateChange = (rateNow - rateBefore).toFixed(2);
        rateChange = 'UP BY' + currency + rateChange + " ▲";
      }
      return rateChange;
    }

  });

  $('.card').click(function(){

  });

  // Date Function

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  var d = new Date();

  var month = monthNames[d.getMonth()];
  var day = d.getDate();
  var year = d.getFullYear();

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

});
