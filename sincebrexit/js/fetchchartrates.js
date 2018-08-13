const https = require('https');
const fs = require('fs');

var graphData = {
  plots: {
    EUR: Array(20),
    USD: Array(20)
  },
  urlDates: []
}


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

console.log(graphData.urlDates)

buildArray('EUR');
buildArray('USD');



function buildArray(currencyID) {

  var getPromises = [];

  for (var i = 0; i < 20; i++) {
    var url = 'https://exchangeratesapi.io/api/' + graphData.urlDates[i] + '?base=GBP';
    var getPromise = new Promise(function(resolve, reject) {
      getData(url, currencyID, i, resolve);
    });
    getPromises.push(getPromise);

  }

  Promise.all(getPromises).then(function() {
    console.log(graphData.plots)
    writeToFile(graphData.plots)
  });
}


function getData(url, currencyID, i, resolve) {
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
        graphData.plots[currencyID][i] = parsedData.rates[currencyID]

        resolve(parsedData.rates[currencyID])

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
  //ratesJSON = fs.readFileSync("json\\rates.json");
  let dataJSON = JSON.stringify(dataObj, null, 2);
  //ratesJSON.rates = dataJSON;
  fs.writeFile('json\\ratestest.json', dataJSON, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}
