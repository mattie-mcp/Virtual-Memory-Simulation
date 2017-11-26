const path = require('path');
const fs = require('fs');
const memory = require('../src/memory');
const fileOperations = require('../src/fileOperations');

describe('basic functionality of file operations', () => {

  it('should load all memory references', () => {
    const testDataPath = path.resolve(__dirname, "test.data");
    let content = fileOperations.readFile(testDataPath);
    expect(content.length).toEqual(25);
  });
});

describe('basic functionality of program', () => {

  it('should retrieve the state', () => {
    const testDataPath = path.resolve(__dirname, "test.2.data");
    memory.startNewProgram(testDataPath)
      .then((response) => memory.nextReference({ next: 'true'}))
      .then((response) => memory.getState())
      .then((stateData) => {
        expect(stateData.status.process).toBe("P1");
        expect(stateData.pageTable.pages.length).toBe(4);
        expect(stateData.physicalMem.length).toBe(16);
      })
      .catch((err) => {
        fail(err);
      });
  });

  it('should move 5 references', () => {
    const testDataPath = path.resolve(__dirname, "test.3.data");
    memory.startNewProgram(testDataPath)
      .then((response) => memory.nextReference({ next: 'true'}))
      .then((response) => memory.nextReference({ next: 'true'}))
      .then((response) => memory.nextReference({ next: 'true'}))
      .then((response) => memory.nextReference({ next: 'true'}))
      .then((response) => memory.nextReference({ next: 'true'}))
      .then((response) => memory.getState())
      .then((stateData) => {
        expect(stateData.status.process).toBe("P2");
        expect(stateData.pageTable.pages.length).toBe(4);
        expect(stateData.physicalMem.length).toBe(16);
      })
      .catch((err) => {
        fail(err);
      });
  });

  afterAll(() => {
    let fileBuffer = fs.readFileSync(path.resolve(__dirname,'test.data'));
    let fileString = fileBuffer.toString();

    fs.writeFileSync(path.resolve(__dirname,'test.1.data'), fileString);
    fs.writeFileSync(path.resolve(__dirname,'test.2.data'), fileString);
    fs.writeFileSync(path.resolve(__dirname,'test.3.data'), fileString);
  });
});