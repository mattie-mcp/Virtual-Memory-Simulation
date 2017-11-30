/**
 * Loads default API routes for frontend to use
 */
const memory = require('../src/memory');
const fileOperations = require('../src/fileOperations');

exports.addRoutes = (app, config) => {

  // Launches a new program based on file input
  app.post('/startNewProgram', (req, res) => {
    if (!req.files)
      return res.status(400).send('No files were uploaded.');

    const inputFile = req.files.file;
    fileOperations.preProcessFile(inputFile)
      .then((fileLocation) => {
        memory.startNewProgram(fileLocation)
        .then((accept, reject) => {
          res.send(accept);
        });
      })
  });

  // Moves to next memory reference
  app.get('/nextReference', (req, res) => {
    memory.nextReference(req.query)
      .then((accept, reject) => {
        res.send(accept);
      });
  });

  // Retrieves state of program
  app.get('/getState', (req, res) => {
    memory.getState(req.query)
      .then((accept, reject) => {
        res.send(accept);
      });
  });

  // Resets program state
  app.post('/reset', (req, res) => {
    memory.reset()
      .then((accept, reject) => {
        res.send(accept);
      });
  });

};