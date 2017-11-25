const config = require('../config.js');
const _ = require('lodash');
const fileOperations = require('./fileOperations');
const pageTable = require('./memory/pageTableManager');

let memoryReferences = [];
let processList = [];
let currentReference = null;

let pcb = {
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
      .then((response) => load(response) )
      .then((response) => fulfill(getReferenceStats()))
      .catch((err) => { throw err; });
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
    Promise.resolve()
      .then(() => {
        if (!memoryReferences) {
          console.log('[info]', 'No memory references found, reloading file');
          fileOperations.getData()
            .then((data) => {
              memoryReferences = data;
            });
        }
        return;
      })
      .then(() => {
        if (!currentReference) {
          currentReference = memoryReferences[0];
        }
        else if (payload.next == 'true') {
          const index = _.indexOf(memoryReferences, currentReference); // get next memory reference
          if (index + 2 > memoryReferences.length) {
            return fulfill(currentReference);
          }
          currentReference = memoryReferences[index + 1];
        }
        else if (payload.previous == 'false') {
          // get last memory reference
        }

        console.log('[info]', 'Moving to reference ' + JSON.stringify(currentReference));
        fulfill(currentReference);
      });

  });
};

/**
 * Retrives memory statistics
 * @param {*} memoryReferences 
 */
const load = (rawReferences) => {
  return new Promise((fulfill, reject) => {
    memoryReferences = _.map(rawReferences, (m) => {
      return {
        process: m.process,
        page: parseInt(m.page, 2)
      };
    });

    parseReferences();

    fulfill();
  });
};

const parseReferences = () => {
  const pNames = _.map(_.uniq(memoryReferences, (p) => {
    return p.process;
  }), (x) => { return x.process });

  for (let i = 0; i < pNames.length; i++) {
    const references = _.where(memoryReferences, { "process": pNames[i] });
    const pages = _.map(_.uniq(references, (r) => {
      return r.page;
    }), (x) => { return x.page; });
    let pEntry = Object.assign({}, pcb);
    pEntry.name = pNames[i];
    pEntry.pageCount = pages.length;
    pEntry.referenceCount = references.length;
    pEntry.pageTablePointer = pageTable.createTable(pEntry.name, pages);
    console.log('info ' + JSON.stringify( pageTable.accessAtIndex(pEntry.pageTablePointer)));
    console.log('[info]', 'Adding process ' + pEntry.name + ' to process table')
    processList.push(pEntry);
  }
};

const getReferenceStats = () => {
  return _.map(processList, (p) => {
    return {
      name: p.name,
      pageCount: p.pageCount,
      refCount: p.referenceCount
    }
  });
};

const getPCB = (processName) => {
  return _.find(processList, (p) => {
    return p.name == processName;
  });
};

const getState = (process) => {
  return new Promise((fulfill, reject) => {
    console.log('process name ' + JSON.stringify(process));
    let _pcb = getPCB(process.processName);
    console.log('pointer: ' + _pcb.pageTablePointer);
    let response = {
      status: currentReference,
      pageTable: pageTable.accessAtIndex(_pcb.pageTablePointer),
      frameTable: null
    };
    console.log('[info]', 'Current state ' + JSON.stringify(response));
    fulfill(response);
  });
};

const memory = {
  getState: getState,
  nextReference: nextReference,
  startNewProgram: startNewProgram
};

module.exports = memory;