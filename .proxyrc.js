module.exports = function(app) {
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')

    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 
      'GET, HEAD, PUT, PATCH, POST, DELETE',
    ); 
    res.setHeader('Access-Control-Allow-Headers', 
      'Origin, X-Requested-With, Content-Type, Accept, Content-Type',
    ); 
    next()
  })
}
