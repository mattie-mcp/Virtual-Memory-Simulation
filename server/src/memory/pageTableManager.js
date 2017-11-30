/**
 * Author: Mattie Phillips
 * Page table manager. Handles all page data structures and operations
 */
const physicalMem = require('./physicalMem');
const _ = require('lodash');

// List of all page tables
let pageTableList = [];

// Page table data structure
let pageTable = {
  process: null,  // for reference only
  pages: []
};

// Page entry within each page table
let pageEntry = {
  page: null,
  frame: null,
  isValid: null
};

/**
 * Creates a single page table and adds it to the 
 * array
 * 
 * @param {String} process Process name
 * @param {int[]} pages array of pages to add
 * Returns index of added page table
 */
const createTable = (process, pages) => {

  let pTable = JSON.parse(JSON.stringify(pageTable));
  pTable.process = process;

  for (let i = 0; i< pages.length; i++) {
    let pEntry = Object.assign({}, pageEntry);
    pEntry.page = pages[i];
    pTable.pages.push(pEntry);
  }

  return pageTableList.push(pTable) - 1; 
};

/**
 * Returns page table at specified index
 * @param {int} index Index of page table to access
 */
const getPageTableAtIndex = (index) => {
  return pageTableList[index];
};

/**
 * Returns all page tables
 */
const getPageTables = () => {
  return pageTableList;
};

/**
 * Returns all frames in physical memory
 */
const getFrames = () => {
  return physicalMem.getFrames();
};

/**
 * Initializes physical memory to specified size
 */
const initializePhysicalMemory = () => {
  return new Promise((resolve, reject) => {
    resolve(physicalMem.initialize());
  });
};

/**
 * Resets all valid bits before each memory access
 */
const resetValidBit = () => {
  for (let i=0; i<pageTableList.length; i++) {
    for (let j=0; j<pageTableList[i].pages.length; j++) {
      pageTableList[i].pages[j].isValid = true;
    }
  }
};

/**
 * Accesses page and frame for memory reference. Updates page with new
 * frame number and access information
 * @param {int} index Page table index to access
 * @param {string} process process name
 * @param {int} page page to access
 * Returns structure containing page fault indicator 
 */
const accessPage = (index, process, page) => {
  physicalMem.resetVictim();
  resetValidBit();
  const _pages = getPageTableAtIndex(index).pages;
  let _page = _.find(_pages, (p) => { return p.page == page; });
  let response = {};

  if (_page.frame == null || _page.isValid == false) {
    let frameIndex = physicalMem.handlePageFault(process, page);
    let victim = null; 
    for (let i=0; i<pageTableList.length; i++) {
      let temp = _.find(pageTableList[i].pages, (p) => { return p.frame == frameIndex; });
      if (temp)
        victim = temp;
    }
    if (victim) {
      victim.frame = null;
      victim.isValid = false;
    }
    _page.frame = frameIndex;
    _page.isValid = true;
    response.pageFault = true;
  }

  _page.frame = physicalMem.getFrame(_page.frame).number;
  return response;
};

/**
 * Resets all data for a new run
 */
const reset = () => {
  pageTableList = [];
  physicalMem.reset();
};

/**
 * Exposed interface to this service
 */
const pageTableManager = {
  initializePhysicalMemory: initializePhysicalMemory,
  createTable: createTable,
  getPageTables: getPageTables,
  getPageTableAtIndex: getPageTableAtIndex,
  getFrames: getFrames,
  accessPage: accessPage,
  reset: reset
};

module.exports = pageTableManager;