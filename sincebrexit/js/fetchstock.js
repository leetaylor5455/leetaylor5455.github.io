const https = require('https');
const fs = require('fs');

var data = {
  rates: {
  }
}

const companiesArray = ['AAL', 'ABF', 'ADM', 'AHT', 'ANTO', 'AV', 'AZN', 'BA', 'BARC', 'BATS', 'BDEV', 'BKG', 'BLND', 'BLT', 'BNZL', 'BP', 'BRBY', 'BT', 'CCH', 'CCL', 'CNA', 'CPG', 'CRDA', 'CRH', 'DCC', 'DGE', 'DLG', 'EVR', 'EXPN', 'EZJ', 'FERG', 'FRES', 'GLEN', 'GSK', 'GVC', 'HL', 'HLMA', 'HSBA', 'IAG', 'IHG', 'III', 'IMB', 'INF', 'ITRK', 'ITV', 'JE', 'JMAT', 'KGF', 'LAND', 'LGEN', 'LLOY', 'LSE', 'MCRO', 'MKS', 'MNDI', 'MRO', 'MRW', 'NG', 'NMC', 'NXT', 'OCDO', 'PPB', 'PRU', 'PSN', 'PSON', 'RB', 'RBS', 'RDSA', 'REL', 'RIO', 'RMG', 'RMV', 'RR', 'RSA', 'RTO', 'SBRY', 'SDR', 'SGE', 'SGRO', 'SHP', 'SKG', 'SKY', 'SLA', 'SMDS', 'SMIN', 'SMT', 'SN', 'SSE', 'STAN', 'STJ', 'SVT', 'TSCO', 'TUI', 'TW', 'ULVR', 'UU', 'VOD', 'WPP', 'WTB'];

var ftse100total = 0;
let url;
const urlp1 = 'https://api.iextrading.com/1.0/stock/'
const urlp2 = '/price'


//getStockRate(urlBuilder(ftse100Sym));
//getStockRate(urlBuilder(ftse250Sym));

for (var i = 0; i < companiesArray.length-1; i++) {
  url = urlp1 + companiesArray[i] + urlp2;
  getStockRate(url);
}




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
        const parsedData = JSON.parse(rawData)
        // Key code here
        console.log(parsedData)
        ftse100total += parsedData;

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
