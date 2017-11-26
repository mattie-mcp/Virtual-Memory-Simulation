
let pageTableList = [];

let pageEntry = {
  page: null,
  frame: null,
  lastAccessed: null
};

const createTable = (pageName, pages) => {
  console.log('pages coming in', JSON.stringify(pages));
  let pageTable = {
    pages: []
  };

  console.log('page length ' + pages.length);
  for (let i = 0; i< pages.length; i++) {
    let pEntry = Object.assign({}, pageEntry);
    pEntry.page = pages[i];
    pageTable.pages.push(pEntry);
  }

  console.log('createTable', JSON.stringify(pageTable));

  return pageTableList.push(pageTable) - 1; 
};

const getPageTableAtIndex = (index) => {
  return pageTableList[index];
};

const pageTableManager = {
  createTable: createTable,
  getPageTableAtIndex: getPageTableAtIndex
};

module.exports = pageTableManager;