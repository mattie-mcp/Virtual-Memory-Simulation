const path = require('path');
const fs = require('fs');
const memory = require('../src/memory');
const fileOperations = require('../src/fileOperations');

describe('testing basic functionality of server', () => {
  it('should load memory references', () => {
    const testDataPath = path.resolve(__dirname, "test.data");
    let content = fileOperations.readFile(testDataPath);
    console.log('back');
    console.log('content ' + JSON.stringify(content));
    // expect(response).to;
  });
});