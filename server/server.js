const express = require('express');
const app = express();
const config = require('./config.js');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const open = require('open');

app.use(morgan('dev'));
app.use(fileUpload());

// load routes
require('./routes/static.js').addRoutes(app, config);
require('./routes/controllerRouter').addRoutes(app, config);
require('./routes/appDefault.js').addRoutes(app, config);

app.listen(8080, () => {
  console.log('server listening on port 8080');
  open('http://localhost:8080');
});

module.exports = app;
