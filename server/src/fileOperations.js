const config = require('../config.js');
const path = require('path');

const fileOperations = {};
fileOperations.fileLocation = '';

fileOperations.readFile = (fileLocation) => {
  return new Promise((fulfill, reject) => {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileLocation)
    });
  
    let content = [];
  
    lineReader.on('line', function (line) {
      let pInfo = line.split(':');
      content.push({ process: pInfo[0].replace(/\s+/g, ''), page: pInfo[1].replace(/\s+/g, '') });
    });
  
    lineReader.on('close', function () {
      fulfill(content);
    });
  });
};

fileOperations.processFile = (inputFile) => {
  return new Promise((fulfill, reject) => {
    fileOperations.fileLocation = path.resolve(__dirname, '../inputFiles/' + inputFile.name);
    
    inputFile.mv(fileOperations.fileLocation, function (err) {
      if (err)
        reject(err);

      fileOperations.readFile(fileOperations.fileLocation)
        .then((data) => {
          let writer = require('fs').createWriteStream(fileOperations.fileLocation);
          writer.write(JSON.stringify(data));
          fulfill(data);
        });
    
    });
  });
};

fileOperations.getData = () => {
  return new Promise((fulfill, reject) => {
    fileOperations.readFile(fileOperations.fileLocation)
      .then((data) => fulfill(data));
  });
};

module.exports = fileOperations;