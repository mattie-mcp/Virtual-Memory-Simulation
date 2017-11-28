const _ = require('lodash');

let frameTable = [];
const size = 16;

let frame = {
  number: null,
  processId: null,
  pageNumber: null,
  lastAccessed: null,
  isVictim: false
};

const initialize = () => {
  frameTable = [];
  for (let i = 0; i < size; i++) {
    let f = Object.assign({}, frame);
    f.number = i;
    frameTable.push(f);
  }
};

const freeFrameLRU = () => {
  let lru = _.min(frameTable, (frame) => { return frame.lastAccessed });
  let lruIndex = _.indexOf(frameTable, lru);
  console.log('[info]', 'lru frame ' + JSON.stringify(lru) + ' lru index ' + lruIndex);

  let victimProcess = frameTable[lruIndex].processId;
  let victimPage = frameTable[lruIndex].pageNumber;
  frameTable[lruIndex].processId = null;
  frameTable[lruIndex].pageNumber = null;
  frameTable[lruIndex].isVictim = true;

  return lruIndex;
;}

const getFrame = (index) => {
  frameTable[index].lastAccessed = Date.now();
  return frameTable[index];
};

const getFrames = () => {
  return frameTable;
};

const handlePageFault = (processId, pageNumber) => {
  let index = null;

  for (let i=0; i<size; i++) {
    if (frameTable[i].processId == null) {
      index = i;
      break;
    }
  }

  // Trap to OS, return free page
  if (index == null)
    index = freeFrameLRU();

  frameTable[index].processId = processId;
  frameTable[index].pageNumber = pageNumber;
  return index;
};

const resetVictim = () => {
  for (let i=0; i<frameTable.length; i++) {
    frameTable[i].isVictim = false;
  }
};

const physicalMem = {
  initialize: initialize,
  handlePageFault: handlePageFault,
  getFrame: getFrame,
  getFrames: getFrames,
  resetVictim: resetVictim
};

module.exports = physicalMem;