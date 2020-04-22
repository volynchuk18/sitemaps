module.exports = {
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://semalt.tech',
        pathRewrite: { '^/api': '' }
      }
    }
  }
}
