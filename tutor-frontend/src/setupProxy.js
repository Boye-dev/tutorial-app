const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:4000",
      // target: "https://babcock-exeat-production.up.railway.app",

      changeOrigin: true,
    })
  );
};
