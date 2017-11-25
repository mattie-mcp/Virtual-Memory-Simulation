const config = require('../config.js');
const _ = require('lodash');
const fileOperations = require('./fileOperations');
const pageTable = require('./memory/pageTableManager');


const memory = {};
memory.memoryReferences = [];
memory.currentReference = {};

let pcb = {
  name: null,
  pageTablePointer: null,
  pageCount: 0,
  referenceCount: 0,
  pageFaultCount: 0
};

let processList = [];

memory.startNewProgram = (file) => {

  return new Promise((fulfill, reject) => {
    fileOperations.processFile(file)
      .then((response) => memory.load(response))
      .then((response) => fulfill(memory.getStats()));
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
memory.changeReference = (payload) => {
  return new Promise((fulfill, reject) => {
    console.log(payload);
    Promise.resolve()
      .then(() => {
        if (!memory.memoryReferences) {
          return fileOperations.getData()
            .then((data) => {
              memory.memoryReferences = data;
            });
        }
        if (!memory.currentReference) {
          memory.currentReference = memory.memoryReferences[0];
        }
        return;
      })
      .then(() => {
        if (payload.next == 'true') {
          // get next memory reference
          const index = _.indexOf(memory.memoryReferences, memory.currentReference);
          console.log(index);
          if (index + 2 > memory.memoryReferences.length) {
            console.log('end');
            fulfill(memory.currentReference);
            return;
          }
          memory.currentReference = memory.memoryReferences[index + 1];
        }
        else if (payload.previous == 'false') {
          // get last memory reference
        }
        console.log(memory.currentReference);
        fulfill(memory.currentReference);
      });

  });
};

memory.getStats = () => {
  return new Promise((fulfill, reject) => {
    const data = _.map(processList, (p) => {
      return {
        name: p.name,
        pageCount: p.pageCount,
        refCount: p.referenceCount
      }
    });
    fulfill(data);
  });
};

/**
 * Retrives memory statistics
 * @param {*} memoryReferences 
 */
memory.load = (memoryReferences) => {
  return new Promise((fulfill, reject) => {
    memory.memoryReferences = _.map(memoryReferences, (m) => {
      return {
        process: m.process,
        page: parseInt(m.page, 2)
      };
    });

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
      processList.push(pEntry);
    }

    fulfill();
  });
};

module.exports = memory;