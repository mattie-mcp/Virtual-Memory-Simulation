
let pageTableList = [];



let pageEntry = {
  page: null,
  frame: null
};

const createTable = (pageName, pages) => {
  console.log('pages coming in', JSON.stringify(pages));
  let pageTable = {
    pages: []
  };

  for (let i = 0; i< pages.length; i++) {
    let pEntry = {
      page: pages[i],
      frame: null
    };
    pageTable.pages.push(pEntry);
  }

  console.log('createTable', JSON.stringify(pageTable));

  return pageTableList.push(pageTable) - 1; 
};

const accessAtIndex = (index) => {
  return pageTableList[index];
};

const pageTableManager = {
  createTable: createTable,
  accessAtIndex: accessAtIndex
};

module.exports = pageTableManager;