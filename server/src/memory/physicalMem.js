let frameTable = [];
const size = 16;

let frame = {
  number: null,
  processId: null,
  pageNumber: null,
  display: false
};

const initialize = () => {
  frameTable = [];
  for (let i = 0; i < size; i++) {
    let f = Object.assign({}, frame);
    f.number = i;
    f.display = true;
    frameTable.push(f);
  }
};

const getFrames = () => {
  return frameTable;
};

const handlePageFault = () => {

};

const mapToMemory = () => {

};

const physicalMem = {
  initialize: initialize,
  getFrames: getFrames
};

module.exports = physicalMem;