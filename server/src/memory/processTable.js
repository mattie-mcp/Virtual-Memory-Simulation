const _ = require('lodash');
const pageTable = require('./pageTableManager');
// process table


const parseReferences = (memoryReferences) => {
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
};

const getReferenceStats = () => {
  return _.map(processList, (p) => {
    return {
      name: p.name,
      pageCount: p.pageCount,
      refCount: p.referenceCount
    }
  });
}

const getProcessTable = (processName) => {
  return _.find(processList, (p) => {
    return p.name == processName;
  });
};

const processTable = {
  parseReferences: parseReferences,
  getProcessTable: getProcessTable,
  getReferenceStats: getReferenceStats
};

module.exports = processTable;