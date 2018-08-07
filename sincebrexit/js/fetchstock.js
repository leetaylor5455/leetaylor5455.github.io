const https = require('https');
const fs = require('fs');

var data = {
  rates: {
  }
}

const urlp1 = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='
const urlp2 = '&interval=1min&apikey=4UNX47U1RYIW8QVQ'

function urlBuilder(symbol) {
  return urlp1 + symbol + urlp2;
}

const ftse100Sym = 'UKX'
const ftse250Sym = 'MCX'

//getStockRate(urlBuilder(ftse100Sym));
//getStockRate(urlBuilder(ftse250Sym));

getStockRate(urlBuilder('UKX'));

function getStockRate(url) {
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
        var timeIndex = parsedData["Meta Data"]['3. Last Refreshed'];
        var stockVal = parsedData["Time Series (1min)"][timeIndex]['4. close'];
        data.rates.FSTE100 = parseFloat(stockVal)
        writeToFile(data);
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}

//writeToFile(data)


// writes currency rates to a file
function writeToFile(dataObj) {
  ratesJSON = fs.readFileSync("json\\rates.json");
  ratesJSON = JSON.parse(ratesJSON)
  //console.log(ratesJSON)
  //console.log(dataObj)
  ratesJSON.rates.FTSE100 = dataObj.rates.FTSE100;
  ratesJSON = JSON.stringify(ratesJSON, null, 2)
  fs.writeFile('json\\rates.json', ratesJSON, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}
