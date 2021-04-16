const path = require('path');

module.exports = {
  entry: './src/core/circles_client.js',
  target: 'web',
  devtool: "source-map",
  output: {
    filename: 'circles_client_bundle.js',
    path: path.resolve(__dirname, 'node_server/public/global/js/'),
  },
};