const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000', // Cambia esto según la URL de tu backend
      changeOrigin: true,
    })
  );
};
