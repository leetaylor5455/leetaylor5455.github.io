$(document).ready(function() {

  console.log($('.front').height());
  $(".back").css("height", $(".front").height());
  $(".back").css("width", $(".front").width());

  // Retreive Newest GBP Values
  $.get("https://exchangeratesapi.io/api/latest?base=GBP", function(rateReturn) {
    var EURRateNow = rateReturn.rates.EUR.toFixed(2);
    var USDRateNow = rateReturn.rates.USD.toFixed(2);
    var CHFRateNow = rateReturn.rates.CHF.toFixed(2);
    console.log("EUR Rate: ", EURRateNow);
    console.log("USD Rate: ", USDRateNow);
    console.log("CHF Rate: ", CHFRateNow);


    var EURRateBefore = 1.3022020236;
    var USDRateBefore = 1.4692745433;
    var CHFRateBefore = 1.6432233616;

    $('#EURRateNow').text("€" + EURRateNow);
    $('#EURRateBefore').text("€" + EURRateBefore.toFixed(2));

    $('#USDRateNow').text("$" + USDRateNow);
    $('#USDRateBefore').text("$" + USDRateBefore.toFixed(2));

    $('#CHFRateNow').text("₣" + CHFRateNow);
    $('#CHFRateBefore').text("₣" + CHFRateBefore.toFixed(2));

    let EURRateChange;
    let USDRateChange;
    let CHFRateChange;

    $('#EURRateChange').text(rateChange(EURRateBefore, EURRateNow, $('#EURvsGBP'), ' €'));
    $('#USDRateChange').text(rateChange(USDRateBefore, USDRateNow, $('#USDvsGBP'), ' $'));
    $('#CHFRateChange').text(rateChange(CHFRateBefore, CHFRateNow, $('#CHFvsGBP'), ' ₣'));

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

  $('.flip-container').click(function(){
    // var cardFront = ($(this).children('div')[0]);
    // var cardBack = ($(this).children('div')[1]);
    // console.log(cardFront)
    // console.log(cardBack)
    // cardFront = 0;
    $('#EURvsGBP').toggle()
    $('cardBack').toggle()
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
