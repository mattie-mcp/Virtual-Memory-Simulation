const config = require('../config.js');
const _ = require('lodash');
const fileOperations = require('./fileOperations');
const memOperations = require('./memory/operations');

const memory = {};
memory.memoryReferences = [];
memory.currentReference = {};
memory.processTable = [];
memory.frameTable = [];

memory.startNewProgram = (file) => {

  return new Promise((fulfill, reject) => {

    fileOperations.processFile(file)
      .then((response) => {
        memory.memoryReferences = response;
        fulfill(memory.getAndUpdateStats(response));
      });
  });
};

const addToPageTable = (pcb) => {

};

const updateData = (rawData) => {
  return new Promise((fulfill, reject) => {
    const pNames = _.map(_.uniq(memoryReferences, (p) => {
      return p.process;
    }), (x) => { return x.process });

    const statsData = _.map(pNames, (p) => {
      const references = _.where(memoryReferences, { "process": p });
      const pages = _.map(_.uniq(references, (r) => {
        return r.page;
      }), (x) => { return x.page; });

      return {
        name: p,
        pageCount: pages.length,
        refCount: references.length
      };
    });

    fulfill(statsData);
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

    Promise.resolve()
      .then(() => {
        if (!memory.memoryReferences) {
          return fileOperations.getData()
            .then((data) => {
              memory.memoryReferences = data;
            });
        }
        return;
      })
      .then(() => {
        let reponse = {};
        if (!payload.current) {
          memory.currentReference = memory.memoryReferences[0];
        }
        else if (payload.next == true) {
          // get next memory reference
          const index = _.indexOf(memory.memoryReferences, memory.currentReference);
          console.log(index);
          if (index+2 > memory.memoryReferences.length) {
            response.next = null;
          }
          memory.currentReference = memory.memoryReferences[index+1];
        }
        console.log(memory.currentReference);
        fulfill(memory.currentReference);
      });

  });
};

/**
 * Retrives memory statistics
 * @param {*} memoryReferences 
 */
memory.getAndUpdateStats = (memoryReferences) => {
  return new Promise((fulfill, reject) => {
    const pNames = _.map(_.uniq(memoryReferences, (p) => {
      return p.process;
    }), (x) => { return x.process });

    const statsData = _.map(pNames, (p) => {
      const references = _.where(memoryReferences, { "process": p });
      const pages = _.map(_.uniq(references, (r) => {
        return r.page;
      }), (x) => { return x.page; });

      return {
        name: p,
        pageCount: pages.length,
        refCount: references.length
      };
    });

    fulfill(statsData);
  });
};

module.exports = memory;