/**
 * Author: Mattie Phillips
 * physicalMem.js encapsulates physical memory and physical memory operations
 */

const _ = require('lodash');

const size = 16;  // number of frames in physical memory

let frameTable = [];  // List of frames that represent physical mem

/**
 * Frame of memory
 */
let frame = {
  number: null,
  processId: null,
  pageNumber: null,
  lastAccessed: null,
  isVictim: false
};

/**
 * Initializes physical memory with defined number of frames
 */
const initialize = () => {
  frameTable = [];
  for (let i = 0; i < size; i++) {
    let f = Object.assign({}, frame);
    f.number = i;
    frameTable.push(f);
  }
};

/**
 * Frees a frame in memory (sets content to null) using the LRU algorithm
 * Returns frame
 */
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

/**
 * Retrieves frame at specified index
 * @param {int} index Frame index to retrieve
 * Returns frame
 */
const getFrame = (index) => {
  frameTable[index].lastAccessed = Date.now();
  return frameTable[index];
};

/**
 * Returns entire state of memory
 */
const getFrames = () => {
  return frameTable;
};

/**
 * Handles case of page fault
 * @param {string} processId process name
 * @param {*} pageNumber page number to access
 */
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

  // Updates new frame
  frameTable[index].processId = processId;
  frameTable[index].pageNumber = pageNumber;
  return index;
};

/**
 * Resets victim bit after every reference
 */
const resetVictim = () => {
  for (let i=0; i<frameTable.length; i++) {
    frameTable[i].isVictim = false;
  }
};

/**
 * Resets state of physical memory
 */
const reset = () => {
  frameTable = [];
};

/**
 * Exposed services
 */
const physicalMem = {
  initialize: initialize,
  handlePageFault: handlePageFault,
  getFrame: getFrame,
  getFrames: getFrames,
  resetVictim: resetVictim,
  reset: reset
};

module.exports = physicalMem;