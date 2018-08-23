const https = require('https');
const fs = require('fs');

// Only needs to run once a year

var ukGDP = [];

https.get('https://api.worldbank.org/v2/countries/gb/indicators/NY.GDP.MKTP.CD?format=json', (res) => {

  const {
    statusCode
  } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => {
    rawData += chunk;
  });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      for (var i = 0; i < 20; i++) {
        ukGDP.push([parsedData[1][i].date + '-12-31', parsedData[1][i].value/1000000000000])
      }
      writeToFile(ukGDP);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

// writes currency rates to a file
function writeToFile(dataObj) {
  ratesJSON = JSON.parse(fs.readFileSync("json/rates.json"));
  let dataJSON = JSON.stringify(dataObj);
  //console.log(ratesJSON.rates[currencyId])
  ratesJSON.rates.GDP = dataObj;
  //console.log(ratesJSON)
  //console.log(dataJSON)
  fs.writeFile('json/rates.json', JSON.stringify(ratesJSON, null, 2), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}
