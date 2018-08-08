const https = require('https');
const fs = require('fs');

let data = {
  rates: {}
}

var todayDate = new Date().toISOString().slice(0, 10);

const latestRatesURL = 'https://exchangeratesapi.io/api/latest?base=GBP';
const latestUnemployURL = 'https://api.ons.gov.uk/dataset/BB/timeseries/MGSC/data';

function gdpURLBuilder(date) {
  const urlSec1 = 'https://www.quandl.com/api/v3/datasets/ODA/GBR_NGDPD.json?end_date=';
  const urlSec2 = '?api_key=B8xkkrnAcricJ1NZGbAw?';
  var url = urlSec1 + date + urlSec2;
  return String(url);
}

'https://www.quandl.com/api/v3/datasets/ODA/GBR_NGDPD.json?end_date=2018-08-08?api_key=B8xkkrnAcricJ1NZGbAw?'

function getData(url, type) {
  https.get(url, (res) => {
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
        //console.log('Parsed Data: ', parsedData);
        if (type == 'currency') {
          data.rates.EUR = parsedData.rates.EUR;
          data.rates.USD = parsedData.rates.USD;
          data.rates.CHF = parsedData.rates.CHF;
        } else if (type == 'gdp') {
          data.rates.GDP = (parsedData.dataset.data[0][1])/1000;
        } else if (type == 'unemployment') {
          data.rates.Unemploy = (((parseInt((parsedData.years[parsedData.years.length-1].value), 10)/1000)/35)*100);
        }
        writeToFile(data);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

// writes currency rates to a file
function writeToFile(dataObj) {
  let dataJSON = JSON.stringify(dataObj, null, 2);
  fs.writeFile('json\\rates.json', dataJSON, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}

getData(gdpURLBuilder(todayDate), 'gdp');
getData(latestRatesURL, 'currency');
getData(latestUnemployURL, 'unemployment')
