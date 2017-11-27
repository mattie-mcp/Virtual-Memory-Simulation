const physicalMem = require('./physicalMem');
const _ = require('lodash');

let pageTableList = [];

let pageTable = {
  process: null,
  pages: []
};

let pageEntry = {
  page: null,
  frame: null,
  isValid: null
};

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

const getPageTableAtIndex = (index) => {
  return pageTableList[index];
};

const getPageTables = () => {
  return pageTableList;
};

const getFrames = () => {
  return physicalMem.getFrames();
};

const initializePhysicalMemory = () => {
  return new Promise((resolve, reject) => {
    resolve(physicalMem.initialize());
  });
};

const accessPage = (index, process, page) => {
  const _pages = getPageTableAtIndex(index).pages;
  let _page = _.find(_pages, (p) => { return p.page == page; });
  let response = {};
  console.log('[info :before]', JSON.stringify(_page) + 'process ' + process + ' page ' + page);

  if (_page.frame == null || _page.isValid == false) {
    let frameIndex = physicalMem.handlePageFault(process, page);
    let victim = null;
    for (let i=0; i<pageTableList.length; i++) {
      let temp = _.find(pageTableList[i].pages, (p) => { return p.frame == frameIndex; });
      if (temp)
        victim = temp;
    }
    console.log('victim information ' + JSON.stringify(victim));
    if (victim)
      victim.frame = null;
    _page.frame = frameIndex;
    _page.isValid = true;
    response.pageFault = true;
  }

  console.log('[info :after]', JSON.stringify(_page));
  _page.frame = physicalMem.getFrame(_page.frame).number;
  // TODO: implement valid/invalid bit
  console.log('[info :after2]', JSON.stringify(_page));
  return response;
};

const pageTableManager = {
  initializePhysicalMemory: initializePhysicalMemory,
  createTable: createTable,
  getPageTables: getPageTables,
  getPageTableAtIndex: getPageTableAtIndex,
  getFrames: getFrames,
  accessPage: accessPage
};

module.exports = pageTableManager;