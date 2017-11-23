const operations = require('../src/operations.js');
const path = require('path');

exports.addRoutes = (app, config) => {

  app.post('/upload', (req, res) => {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    const inputFile = req.files.inputFile;
    const dest = path.resolve(__dirname, '../inputFiles/' + inputFile.name);

    inputFile.mv(dest, function(err) {
      if (err)
        return res.status(500).send(err);
        
      const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(dest)
      });

      let content = [];
      
      lineReader.on('line', function (line) {
        let pInfo = line.split(':');
        content.push({process: pInfo[0].replace(/\s+/g, ''), page: pInfo[1].replace(/\s+/g, '')});
      });

      lineReader.on('close', function () {
        console.log(JSON.stringify(content));
        return res.send(content); 
      });

    });
  });
};