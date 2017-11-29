const config = require('../config.js');
const _ = require('lodash');
const fileOperations = require('./fileOperations');
const pageTable = require('./memory/pageTableManager');

let memoryReferences = [];
let processList = [];
let currentReference = null;

const memoryReference = {
  index: null,
  process: null,
  page: null
};

const pcb = {
  name: null,
  pageTablePointer: null,
  pageCount: 0,
  referenceCount: 0,
  pageFaultCount: 0
};

const startNewProgram = (fileLocation) => {
  console.log('[info]', 'Loading new set of memory references');
  memoryReferences = [];
  processList = [];
  currentReference = null;
  // TODO: Reset data in other files

  return new Promise((fulfill, reject) => {
    fileOperations.processFile(fileLocation)
      .then((response) => load(response))
      .then(() => createProcessTable())
      .then(() => fulfill(pageTable.initializePhysicalMemory()))
      .catch((err) => { reject(err); });
  });
};

/**
 * Moves to the next memory reference
 * 
 * @param {Object} payload in the form of an object with two nodes, next and current
 * next: -1 or 1 (-1 = previous, 1 = next)
 * current: current instruction
 * 
 */
const nextReference = (payload) => {
  return new Promise((fulfill, reject) => {
    if (currentReference == null) {
      currentReference = memoryReferences[0];
    }
    else if (payload.next == 'true') {
      const index = _.indexOf(memoryReferences, currentReference); // get next memory reference
      if (index + 2 > memoryReferences.length) {
        return fulfill(currentReference);
      }
      // move to next state
      currentReference = memoryReferences[index + 1];
    }
    else if (payload.previous == 'false') {
      // get last memory reference
    }
    // trigger logical memory access
    const _pcb = getPCB(currentReference.process);
    const memOperation = pageTable.accessPage(_pcb.pageTablePointer, currentReference.process, currentReference.page);
    if (memOperation.pageFault) {
      _pcb.pageFaultCount++;
    }

    console.log('[info]', 'Moving to reference ' + JSON.stringify(currentReference));
    fulfill(currentReference);
  })
    .catch((err) => { reject(err); });;
};

/**
 * Retrives memory statistics
 * @param {*} memoryReferences 
 */
const load = (rawReferences) => {
  return new Promise((fulfill, reject) => {
    let i = 1;
    memoryReferences = _.map(rawReferences, (m) => {
      let mRef = Object.assign({}, memoryReference);
      mRef.index = i++;
      mRef.process = m.process;
      mRef.page = parseInt(m.page, 2);
      return mRef;
    });

    fulfill(memoryReferences);
  })
    .catch((err) => { reject(err); });;
};

const createProcessTable = () => {
  return new Promise((fulfill, reject) => {
    const processNames = _.map(_.uniq(memoryReferences, (p) => {
      return p.process;
    }), (x) => { return x.process });

    for (let i = 0; i < processNames.length; i++) {

      const references = _.where(memoryReferences, { "process": processNames[i] });
      const pages = _.map(_.uniq(references, (r) => {
        return r.page;
      }), (x) => { return x.page; });

      let pEntry = Object.assign({}, pcb);
      pEntry.name = processNames[i];
      pEntry.pageCount = pages.length;
      pEntry.referenceCount = references.length;
      pEntry.pageTablePointer = pageTable.createTable(pEntry.name, pages);

      console.log('[info]', 'Adding process ' + pEntry.name + ' to process table');
      processList.push(pEntry);
    }

    fulfill(processList);
  })
    .catch((err) => { reject(err); });;
};

const getReferenceStats = () => {
  return processList;
};

const getPCB = (processName) => {
  return _.find(processList, (p) => {
    return p.name == processName;
  });
};

const getState = () => {
  return new Promise((fulfill, reject) => {
    const _pcb = getPCB(currentReference.process);

    let response = {
      status: currentReference,
      processStats: processList,
      pageTables: pageTable.getPageTables(),
      physicalMem: pageTable.getFrames(),
      pageFault: pageTable.pageFault,
      progress: {
        min: 0,
        current: currentReference.index,
        max: memoryReferences.length
      }
    };
    console.log('[info]', 'Current state ' + JSON.stringify(response));
    fulfill(response);
  })
    .catch((err) => { reject(err); });;
};

const memory = {
  getState: getState,
  nextReference: nextReference,
  startNewProgram: startNewProgram
};

module.exports = memory;