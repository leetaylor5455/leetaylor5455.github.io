const https = require('https');
const fs = require('fs');
var yahooFinance = require('yahoo-finance');

var graphData = {
  plots: {
    EUR: Array(20),
    USD: Array(20),
    Unemploy: [],
    Inflation: []
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

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const unemployURL = 'https://api.ons.gov.uk/dataset/LMS/timeseries/MGSX/data';
const inflationURL = 'https://api.ons.gov.uk/dataset/MM23/timeseries/L55O/data';


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
  graphData.urlDates.push(new Date(todayDate.setDate(todayDate.getDate() - dayInterval)).toISOString().slice(0, 10));
}

graphData.urlDates[19] = '2016-06-22';

buildArray('EUR');
buildArray('USD');


function buildArray(currencyId) {

  var getPromises = [];

  for (var i = 19; i >= 0; i--) {
    var url = 'https://api.exchangeratesapi.io/' + graphData.urlDates[i] + '?base=GBP';
    console.log(url)
    var getPromise = new Promise(function(resolve, reject) {
      getChartData(url, graphData.urlDates[i], currencyId, i, resolve);
    });
    getPromises.push(getPromise);

  }

  Promise.all(getPromises).then(function() {
    //console.log(graphData.plots)
    writeToFile(graphData.plots[currencyId], currencyId)
  });
}


function getChartData(url, date, currencyId, i, resolve) {
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
        graphData.plots[currencyId][i] = [date, parsedData.rates[currencyId]]

        resolve(parsedData.rates[currencyId])

      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

function getONSData(url, id) {
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

        var i = parsedData.months.length-1;
        while (parsedData.months[i].date != '2016 MAY') {
          var monthDigit = monthNames.indexOf(parsedData.months[i].date.substring(5,8)) + 1
          if (String(monthDigit).length == 1) {
            monthDigit = '0' + monthDigit;
          }
          graphData.plots[id].push([parsedData.months[i].date.substring(0,4) + '-' + monthDigit + '-' + '01', parseFloat(parsedData.months[i].value)]);
          i--;
        }
        writeToFile(graphData.plots[id], id);
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
  writeToFile([startFullDate, quotes.price.regularMarketPrice], 'FTSE100')
});

yahooFinance.quote({
  symbol: '^FTMC',
  modules: ['price']
}, function (err, quotes) {
  writeToFile([startFullDate, quotes.price.regularMarketPrice], 'FTSE250')
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

getONSData(unemployURL, 'Unemploy')
getONSData(inflationURL, 'Inflation')
