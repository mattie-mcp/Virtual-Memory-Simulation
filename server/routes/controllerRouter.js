const memory = require('../src/memory');
const fileOperations = require('../src/fileOperations');

exports.addRoutes = (app, config) => {

  app.post('/startNewProgram', (req, res) => {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    const inputFile = req.files.file;
    memory.startNewProgram(inputFile)
      .then((accept, reject) => {
        res.send(accept);
      });
  });

  app.get('/changeReference', (req, res) => {
    memory.changeReference(req.query)
      .then((accept, reject) => {
        res.send(accept);
      });
  });

  app.post('/upload', (req, res) => {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    const inputFile = req.files.file;
    fileOperations.processFile(inputFile)
      .then((accept, reject) => {
        res.send(accept);
      });
  });

  app.post('/getInformation', (req, res) => {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    const inputFile = req.files.file;
    memory.getMemoryInfo(inputFile)
      .then((accept, reject) => {
        res.send(accept);
      });
  });
};