
let pageTableList = [];

let pageTable = {
  name: null,
  pages: []
};

let pageEntry = {
  page: null,
  frame: null
};

const createTable = (pageName, pages) => {
  let pTable = Object.assign({}, pageTable);
  pTable.name = pageName;

  for (let i = 0; i< pages.length; i++) {
    let pEntry = Object.assign({}, pageEntry);
    pEntry.page = pages[i];
    pTable.pages.push(pEntry);
  }

  return pageTableList.push(pTable) - 1; 
};

const accessAtIndex = (index) => {
  return pageTableList[index];
};

const pageTableManager = {
  createTable: createTable
};

module.exports = pageTableManager;