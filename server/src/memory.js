const config = require('../config.js');
const _ = require('lodash');
const fileOperations = require('./fileOperations');
const pageTable = require('./memory/pageTableManager');

let memoryReferences = [];
let processList = [];

let pcb = {
  name: null,
  pageTablePointer: null,
  pageCount: 0,
  referenceCount: 0,
  pageFaultCount: 0
};

const startNewProgram = (file) => {

  return new Promise((fulfill, reject) => {
    fileOperations.processFile(file)
      .then((response) => load(response))
      .then((response) => fulfill(getReferenceStats()));
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
        if (!this.memoryReferences) {
          console.log('getting memory references');
          fileOperations.getData()
            .then((data) => {
              this.memoryReferences = data;
            });
        }
        if (!this.currentReference) {
          console.log('changing');
          this.currentReference = this.memoryReferences[0];
        }
        return;
      })
      .then(() => {
        console.log('current reference: ' + this.currentReference);
        if (payload.next == 'true') {
          const index = _.indexOf(this.memoryReferences, this.currentReference); // get next memory reference
          if (index + 2 > this.memoryReferences.length) {
            return fulfill(this.currentReference);
          }
          this.currentReference = this.memoryReferences[index + 1];
        }
        else if (payload.previous == 'false') {
          // get last memory reference
        }

        fulfill(this.currentReference);
      });

  });
};

/**
 * Retrives memory statistics
 * @param {*} memoryReferences 
 */
const load = (rawReferences) => {
  return new Promise((fulfill, reject) => {
    this.memoryReferences = _.map(rawReferences, (m) => {
      return {
        process: m.process,
        page: parseInt(m.page, 2)
      };
    });

    console.log('mem references in load' + JSON.stringify(memoryReferences));
    parseReferences();

    fulfill();
  });
};

const parseReferences = () => {
  console.log(' mem references' + JSON.stringify(memoryReferences));
  const pNames = _.map(_.uniq(memoryReferences, (p) => {
    return p.process;
  }), (x) => { return x.process });

  for (let i = 0; i < pNames.length; i++) {
    const references = _.where(memoryReferences, { "process": pNames[i] });
    const pages = _.map(_.uniq(references, (r) => {
      return r.page;
    }), (x) => { return parseInt(x.page, 2); });

    let pEntry = Object.assign({}, pcb);
    pEntry.name = pNames[i];
    pEntry.pageCount = pages.length;
    pEntry.referenceCount = references.length;
    pEntry.pageTablePointer = pageTable.createTable(pEntry.name, pages);
    this.processList.push(pEntry);
  }
};

const getReferenceStats = () => {
  console.log('process list' + JSON.stringify(this.processList));
  return _.map(this.processList, (p) => {
    return {
      name: p.name,
      pageCount: p.pageCount,
      refCount: p.referenceCount
    }
  });
};

const getProcessTable = (processName) => {
  return _.find(this.processList, (p) => {
    return p.name == processName;
  });
};

const getState = (processName) => {
  console.log(processName);
  return new Promise((fulfill, reject) => {
    let response = {
      status: this.currentReference,
      pageTable: getProcessTable(processName),
      frameTable: null
    };
    console.log(response);
    fulfill(response);
  });
};

const memory = {
  getState: getState,
  nextReference: nextReference,
  startNewProgram: startNewProgram
};

module.exports = memory;