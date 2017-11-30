/**
 * Author: Mattie Phillips
 * Handles and orchestrates all operations to memory
 */
const config = require('../config.js');
const _ = require('lodash');
const fileOperations = require('./fileOperations');
const pageTableManager = require('./memory/pageTableManager');

// All memory references to be accessed
let memoryReferences = [];
// List of all processes, PCBs
let processList = [];
// Current memory reference
let currentReference = null;

// Structure of memory reference
const memoryReference = {
  index: null,
  process: null,
  page: null
};

// Structure of PCB
const pcb = {
  name: null,
  pageTablePointer: null,
  pageCount: 0,
  referenceCount: 0,
  pageFaultCount: 0
};

/**
 * Starts a new program by reading in file, prepopulating data,
 * and initializing all memory resources
 * @param {String} fileLocation File to be read in
 */
const startNewProgram = (fileLocation) => {
  console.log('[info]', 'Loading new set of memory references');
  memoryReferences = [];
  processList = [];
  currentReference = null;

  return new Promise((fulfill, reject) => {
    reset()
      .then(() => fileOperations.processFile(fileLocation) )
      .then((response) => load(response))
      .then(() => createProcessTable())
      .then(() => fulfill(pageTableManager.initializePhysicalMemory()))
      .catch((err) => { reject(err); });
  });
};

/**
 * Resets state of program
 */
const reset = () => {
  return new Promise((fulfill, reject) => {
    memoryReferences = [];
    processList = [];
    currentReference = null;
    pageTableManager.reset();
    fulfill();
  })
};

/**
 * Moves to the next memory reference
 * 
 * @param {Object} payload in the form of an object with two nodes, next and current
 * next: 1 (-1 = previous, 1 = next)
 * current: current instruction
 * 
 */
const nextReference = (payload) => {
  return new Promise((fulfill, reject) => {
    if (currentReference == null) {
      currentReference = memoryReferences[0];
    }
    else if (payload.next == 'true') {
      // Protects out of bounds exception
      const index = _.indexOf(memoryReferences, currentReference); // get next memory reference
      if (index + 2 > memoryReferences.length) {
        return fulfill(currentReference);
      }
      // move to next state
      currentReference = memoryReferences[index + 1];
    }
    // trigger logical memory access
    const _pcb = getPCB(currentReference.process);
    const memOperation = pageTableManager.accessPage(_pcb.pageTablePointer, currentReference.process, currentReference.page);
    if (memOperation.pageFault) {
      currentReference.pageFault = true;
      _pcb.pageFaultCount++;
    }

    console.log('[info]', 'Moving to reference ' + JSON.stringify(currentReference));
    fulfill(currentReference);
  })
    .catch((err) => { throw err; });
};

/**
 * Loads raw references into structured list of memory references
 * @param {string[]} memoryReferences 
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
  .catch((err) => { throw err; });
};

/**
 * Creates an initial process table based on all memory references
 */
const createProcessTable = () => {
  return new Promise((fulfill, reject) => {
    // List of process names
    const processNames = _.map(_.uniq(memoryReferences, (p) => {
      return p.process;
    }), (x) => { return x.process });

    for (let i = 0; i < processNames.length; i++) {
      // Get all references for process
      const references = _.where(memoryReferences, { "process": processNames[i] });
      // Get all pages for process
      const pages = _.map(_.uniq(references, (r) => {
        return r.page;
      }), (x) => { return x.page; });

      let pEntry = Object.assign({}, pcb);
      pEntry.name = processNames[i];
      pEntry.pageCount = pages.length;
      pEntry.referenceCount = references.length;
      pEntry.pageTablePointer = pageTableManager.createTable(pEntry.name, pages);  // create page table

      console.log('[info]', 'Adding process ' + pEntry.name + ' to process table');
      processList.push(pEntry);
    }

    fulfill(processList);
  })
  .catch((err) => { throw err; });
};

/**
 * Returns PCB for specified process name
 */
const getPCB = (processName) => {
  return _.find(processList, (p) => {
    return p.name == processName;
  });
};

/**
 * Returns entire state of program
 */
const getState = () => {
  return new Promise((fulfill, reject) => {
    const _pcb = getPCB(currentReference.process);

    let response = {
      status: currentReference,
      processStats: processList,
      pageTables: pageTableManager.getPageTables(),
      physicalMem: pageTableManager.getFrames(),
      progress: {
        min: 0,
        current: currentReference.index,
        max: memoryReferences.length
      }
    };
    console.log('[info]', 'Current state ' + JSON.stringify(response));
    fulfill(response);
  })
  .catch((err) => { throw err; });
};

/**
 * Exposed services
 */
const memory = {
  getState: getState,
  nextReference: nextReference,
  startNewProgram: startNewProgram,
  reset: reset
};

module.exports = memory;