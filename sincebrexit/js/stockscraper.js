var yahooFinance = require('yahoo-finance');
const fs = require('fs');

// This replaces the deprecated snapshot() API
yahooFinance.quote({
  symbol: '^FTSE',
  modules: [ 'price' ] // see the docs for the full list
}, function (err, quotes) {
  console.log(quotes.price)
  writeToFile(quotes.price.regularMarketPrice);
});


// writes rates to a file
function writeToFile(dataObj) {
  ratesJSON = JSON.parse(fs.readFileSync("json/rates.json"));
  ratesJSON.rates.FTSE100 = dataObj;
  //console.log(ratesJSON)
  //console.log(dataJSON)
  fs.writeFile('json/rates.json', JSON.stringify(ratesJSON, null, 2), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}
