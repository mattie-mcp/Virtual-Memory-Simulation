const config = require('../config.js');
const path = require('path');
const es = require('event-stream');
const fs = require('fs');
const _ = require('lodash');

let fileLocation = '';

const readFile = (fileLocation) => {
  let content = [];

  let fileBuffer = fs.readFileSync(fileLocation);
  let fileString = fileBuffer.toString();
  
  content = fileString.trim().split('\r\n');
  content = _.map(content, (line) => {
    if (line == '') {
      return null;
    }
    let pInfo = line.split(':');
    return { process: pInfo[0].replace(/\s+/g, ''), page: pInfo[1].replace(/\s+/g, '') };
  });

  return content;
};

const preProcessFile = (inputFile) => {
  return new Promise((fulfill, reject) => {
    fileLocation = path.resolve(__dirname, '../inputFiles/' + inputFile.name);

    inputFile.mv(fileLocation, (err) => {
      if (err) {
        console.log('err');
        reject(err);
      }
      return fulfill(fileLocation);
    });
  });
};

const processFile = (fileLocation) => {
  return new Promise((fulfill, reject) => {
    let content = readFile(fileLocation);
    let writer = require('fs').createWriteStream(fileLocation);
    writer.write(JSON.stringify(content));
    return fulfill(content);
  });
};

const getData = () => {
  return new Promise((fulfill, reject) => {
    const data = readFile(fileLocation);
    console.log('data ' + data);
    fulfill(data);
  });
};

const fileOperations = {
  preProcessFile: preProcessFile,
  processFile: processFile,
  readFile: readFile
};
module.exports = fileOperations;