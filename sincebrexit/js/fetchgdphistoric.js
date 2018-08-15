const https = require('https');
const fs = require('fs');

https.get('https://www.quandl.com/api/v3/datasets/ODA/GBR_NGDPD.json?end_date=2018-08-08?api_key=B8xkkrnAcricJ1NZGbAw?', (res) => {
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
      writeToFile(parsedData.dataset.data.reverse());
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});



function writeToFile(dataObj) {
  let dataJSON = JSON.stringify(dataObj, null, 2);
  fs.writeFile('json/gdphistoric.json', dataJSON, (err) => {
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('File saved successfully.');
  });
}
