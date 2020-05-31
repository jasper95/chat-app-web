const { createProxyMiddleware }  = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL,
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`,
        ).toString('base64')}`,
      },
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    }),
  )
}
