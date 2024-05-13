module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/sample/mxcadiframe/' :  '/',
  devServer: {
    　  host: 'localhost',
    　　port: 8081
    　}
};