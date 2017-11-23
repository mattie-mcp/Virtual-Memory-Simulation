var path = require('path');

module.exports = {
  app: {
    computerCount: 24,
    refreshDatastore: true
  },
  db : {
    computers: path.join(__dirname, '/src/db/computers.db')
  },
  server: {
    distFolder: path.resolve(__dirname, '../client/dist'),
    staticFolder: path.resolve(__dirname, '../client/assets')
  }
};