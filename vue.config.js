module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://10.200.96.223:10000',
        secure: false,
      },
    }
  }
}
