const https = require('https');
const fs = require('fs');
var yahooFinance = require('yahoo-finance');

var graphData = {
  plots: {
    EUR: Array(20),
    USD: Array(20)
  },
  urlDates: []
}


var data = {
  rates: {
    Unemploy: 0,
    EUR: [],
    USD: []
  }
}

var todayDate = new Date().toISOString().slice(0, 10);

const latestUnemployURL = 'https://api.ons.gov.uk/dataset/BB/timeseries/MGSC/data';


var startFullDate = new Date().toISOString().slice(0, 10);
var day = startFullDate.substring(8, 10)
var year = parseInt(startFullDate.substring(0, 4), 10)
var startMonth = parseInt(startFullDate.substring(5, 7), 10)


var todayDate = new Date();
var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
var firstDate = new Date('2016-06-22');

// Difference between today and referendum in days
var diffDays = Math.round(Math.abs((firstDate.getTime() - todayDate.getTime())/(oneDay)));
// Works out even day interval for 20 rates since referendum
var dayInterval = Math.round(diffDays/19);

// Makes todayDate one interval ahead so it returns today's date in the first loop iteration
todayDate = new Date(todayDate.setDate(todayDate.getDate() + dayInterval))


for (var i = 0; i < 20; i++) {
  graphData.urlDates.unshift(new Date(todayDate.setDate(todayDate.getDate() - dayInterval)).toISOString().slice(0, 10));
}

graphData.urlDates[0] = '2016-06-22';

//console.log(graphData.urlDates)

buildArray('EUR');
buildArray('USD');



function buildArray(currencyId) {

  var getPromises = [];

  for (var i = 0; i < 20; i++) {
    var url = 'https://exchangeratesapi.io/api/' + graphData.urlDates[i] + '?base=GBP';
    var getPromise = new Promise(function(resolve, reject) {
      getChartData(url, currencyId, i, resolve);
    });
    getPromises.push(getPromise);

  }

  Promise.all(getPromises).then(function() {
    //console.log(graphData.plots)
    writeToFile(graphData.plots[currencyId], currencyId)
  });
}


function getChartData(url, currencyId, i, resolve) {
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
        graphData.plots[currencyId][i] = parsedData.rates[currencyId]

        resolve(parsedData.rates[currencyId])

      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function getUnemployment(url) {
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
        // console.log('Parsed Data: ', parsedData);
        var Unemploy = (((parseInt((parsedData.years[parsedData.years.length-1].value), 10)/1000)/35)*100);
        writeToFile(Unemploy, 'Unemploy');
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}


yahooFinance.quote({
  symbol: '^FTSE',
  modules: ['price']
}, function (err, quotes) {
  writeToFile(quotes.price.regularMarketPrice, 'FTSE100')
});

// writes currency rates to a file
function writeToFile(dataObj, currencyId) {
  ratesJSON = JSON.parse(fs.readFileSync("json/rates.json"));
  ratesJSON.rates[currencyId] = dataObj;
  //console.log(ratesJSON)
  //console.log(dataJSON)
  fs.writeFile('json/rates.json', JSON.stringify(ratesJSON, null, 2), (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}

getUnemployment(latestUnemployURL)
