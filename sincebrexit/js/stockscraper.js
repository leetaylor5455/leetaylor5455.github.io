var yahooFinance = require('yahoo-finance');
const fs = require('fs');

var todayDate = new Date().toISOString().slice(0, 10);


yahooFinance.historical({
  symbol: '^FTSE',
  from: '2016-06-19',
  to: todayDate,
  period: 'w'
}, function (err, quotes) {
  if (err) {
    throw err;
  } else {
    writeToFile(quotes);
  }
});




// writes rates to a file
function writeToFile(dataObj) {
  ratesJSON = JSON.parse(fs.readFileSync("json/stockrates.json"));
  ratesJSON.rates.FTSE100 = dataObj;
  //console.log(ratesJSON)
  //console.log(dataJSON)
  fs.writeFile('json/stockrates.json', JSON.stringify(ratesJSON, null, 2), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}