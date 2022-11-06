module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://185.143.174.20:10000/',
        secure: false,
      },
    }
  }
}
