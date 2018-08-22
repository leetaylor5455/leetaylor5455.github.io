const yahooFinance = require('yahoo-finance');
const fs = require('fs');

const todayDate = new Date().toISOString().slice(0, 10);


yahooFinance.historical({
  symbol: '^FTSE',
  from: '2016-06-19',
  to: todayDate,
  period: 'w'
}, function (err, quotes) {
  if (err) {
    throw err;
  } else {
    writeToFile(quotes, 'FTSE100');
  }
}).then(function() {
  yahooFinance.historical({
    symbol: '^FTMC',
    from: '2016-06-19',
    to: todayDate,
    period: 'w'
  }, function (err, quotes) {
    if (err) {
      throw err;
    } else {
      writeToFile(quotes, 'FTSE250');
    }
  });
});





// writes rates to a file
function writeToFile(dataObj, symbol) {
  ratesJSON = JSON.parse(fs.readFileSync("json/stockrates.json"));

  ratesJSON.rates[symbol] = dataObj;
  //console.log(ratesJSON)
  //console.log(dataJSON)
  fs.writeFile('json/stockrates.json', JSON.stringify(ratesJSON, null, 2), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}
