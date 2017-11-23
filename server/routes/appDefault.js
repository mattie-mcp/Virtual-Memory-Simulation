exports.addRoutes = (app, config) => {
  app.all('/*', (req, res) => {
    res.sendFile('index.html', { root: config.server.distFolder });
  });
};