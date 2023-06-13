const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware('/auth/token', {
      target: 'http://11.0.0.118:9090',
      changeOrigin: true,
    })
  );
};
