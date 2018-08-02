$(document).ready(function() {

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

  // $.get('https://api.ons.gov.uk/dataset/BB/timeseries/MGSC/data', function(data) {
  //   var rate = data.years[data.years.length-1].value;
  //   console.log('Unemployment Rate: ', rate);
  // });

  $.get("js\\rates.json", function(returnedVals) {
    var EURRateNow = returnedVals.rates.EUR.toFixed(2);
    var USDRateNow = returnedVals.rates.USD.toFixed(2);
    var CHFRateNow = returnedVals.rates.CHF.toFixed(2);
    var GDPNow = ((returnedVals.rates.GDP)/1000).toFixed(2);
    var unemployNow = (((returnedVals.rates.Unemployment/1000)/35)*100).toFixed(2);
    console.log("EUR Rate: ", EURRateNow);
    console.log("USD Rate: ", USDRateNow);
    console.log("CHF Rate: ", CHFRateNow);
    console.log("UK GDP: ", GDPNow);
    console.log("Unemployment now: ", unemployNow);

    const EURRateBefore = 1.3022020236.toFixed(2);
    const USDRateBefore = 1.4692745433.toFixed(2);
    const CHFRateBefore = 1.6432233616.toFixed(2);
    const GDPBefore = (2863.304/1000).toFixed(2);
    const unemployBefore = ((1.633/34.1)*100).toFixed(2);


    $('#EURRateNow').text("€" + EURRateNow);
    $('#EURRateBefore').text("€" + EURRateBefore);

    $('#USDRateNow').text("$" + USDRateNow);
    $('#USDRateBefore').text("$" + USDRateBefore);

    $('#CHFRateNow').text("₣" + CHFRateNow);
    $('#CHFRateBefore').text("₣" + CHFRateBefore);

    $('#GDPNow').text("$" + GDPNow);
    $('#GDPBefore').text("$" + GDPBefore);

    $('#UnemployNow').text(unemployNow + "%");
    $('#UnemployBefore').text(unemployBefore + "%");

    let EURRateChange;
    let USDRateChange;
    let CHFRateChange;
    let GDPChange;
    let unemployChange;

    $('#EURRateChange').text(rateChange(EURRateBefore, EURRateNow, $('#EURvsGBP'), ' €'));
    $('#USDRateChange').text(rateChange(USDRateBefore, USDRateNow, $('#USDvsGBP'), ' $'));
    $('#CHFRateChange').text(rateChange(CHFRateBefore, CHFRateNow, $('#CHFvsGBP'), ' ₣'));
    $('#GDPChange').text(rateChange(GDPBefore, GDPNow, $('#GDP'), ' $'));
    $('#UnemployChange').text(rateChange(unemployBefore*-1, unemployNow*-1, $('#Unemploy'), '% '));


    function rateChange(rateBefore, rateNow, changer, symbol) {
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

  });

  // console.log(getUKGDP(todayDateString));
  // console.log(getUKGDP('2016-06-22'));

  $('.flip-container').click(function(){
    // var cardFront = ($(this).children('div')[0]);
    // var cardBack = ($(this).children('div')[1]);
    // console.log(cardFront)
    // console.log(cardBack)
    // cardFront = 0;
    $('#EURvsGBP').toggle()
    $('cardBack').toggle()
  });



});
