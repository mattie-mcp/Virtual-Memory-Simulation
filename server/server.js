const express = require('express');
const app = express();
const config = require('./config.js');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

app.use(morgan('dev'));
app.use(fileUpload());
// TODO: Look into nodemon

// load routes
require('./routes/static.js').addRoutes(app, config);
require('./routes/controllerRouter').addRoutes(app, config);
require('./routes/appDefault.js').addRoutes(app, config);

app.listen(8080, () => {
  //var open = require('open');
  //open('http://localhost:3000');
  console.log('server listening on port 8080');
});

module.exports = app;
