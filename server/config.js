var path = require('path');

module.exports = {
  server: {
    distFolder: path.resolve(__dirname, '../client/dist'),
    staticFolder: path.resolve(__dirname, '../client/assets')
  }
};