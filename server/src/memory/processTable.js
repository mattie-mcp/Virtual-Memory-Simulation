// process table
const _ = require('lodash');

let pcb = {
    name: null,
    pageTablePointer: null,
    pageFaultCount: 0
};

let processList = [];

const retrieve = (processName) => {
    return _.find(processList, (p) => {
        return p.name == processName;
    });
};

const addProcess = (processName, pages) => {
    let p = Object.assign({}, pcb);
    p.name = processList;
    processList.push(p);
};

const processTable = {
    retrieve: retrieve,
    addProcess: addProcess
};

module.exports = processTable;