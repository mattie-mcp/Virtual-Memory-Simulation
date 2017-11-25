// process table

let pcb = {
    name: null,
    pointer: null,
    pageFaultCount: 0
};

let processList = [];

const retrieve = (processName) => {
    // lookup in table and return
};

const addProcess = (processName) => {
    //add pcb to table
};

const processTable = {
    retrieve: retrieve,
    addProcess: addProcess
};

module.exports = processTable;