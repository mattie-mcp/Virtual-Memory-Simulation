/**
 * Author: Mattie Phillips
 * Reads in and processes input file
 */
const config = require('../config.js');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

let fileLocation = '';

/**
 * Reads in file and returns array of memory references
 * @param {string} fileLocation Location of file to parse
 * Returns array of memory references
 */
const readFile = (fileLocation) => {
  let content = [];

  let fileBuffer = fs.readFileSync(fileLocation);
  let fileString = fileBuffer.toString();
  
  content = fileString.trim().split('\n');
  content = _.map(content, (line) => {
    line.replace(/\\n/, "");
    line.replace(/\\r/, "");
    if (line == '' || line == '\n' || line == '\r') {
      return null;
    }
    let pInfo = line.split(':');
    if (pInfo.length != 2) {
      return null;
    }
    return { process: pInfo[0].replace(/\s+/g, ''), page: pInfo[1].replace(/\s+/g, '') };
  });

  _.remove(content, (row => { return row == null }));
  return content;
};

/**
 * Saves file locally first if necessary
 * @param {string} inputFile File location
 */
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

/**
 * Saves new format of file locally
 * @param {string} fileLocation  File location
 */
const processFile = (fileLocation) => {
  return new Promise((fulfill, reject) => {
    let content = readFile(fileLocation);
    let writer = require('fs').createWriteStream(fileLocation);
    writer.write(JSON.stringify(content));
    return fulfill(content);
  });
};

/**
 * Re-reads file and returns data
 */
const getData = () => {
  return new Promise((fulfill, reject) => {
    const data = readFile(fileLocation);
    console.log('data ' + data);
    fulfill(data);
  });
};

/**
 * Exposed services
 */
const fileOperations = {
  preProcessFile: preProcessFile,
  processFile: processFile,
  readFile: readFile
};
module.exports = fileOperations;