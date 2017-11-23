var express = require('express');
var compression = require('compression');

exports.addRoutes = (app, config) => {

  //app.use(express.favicon(config.server.distFolder + '/favicon.ico'));
  app.use('/static', compression());
  app.use('/static', express.static(config.server.staticFolder));
  app.use('/dist', express.static(config.server.distFolder));
  
  app.use('/static', (req, res, next) => {
    res.sendStatus(404);
  });
};