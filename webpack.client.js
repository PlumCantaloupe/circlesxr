'use strict';
const fs    = require('fs');
const path  = require('path');
// const StringReplacePlugin = require("string-replace-loader");

// Set up and parse Environment based configuation
const dotenv                = require('dotenv');
const dotenvParseVariables  = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

module.exports = {
  module: {
    rules: [
      {
        //test: /.\/src\/core\/circles_constants\.js$/,
        test: /circles_constants\.js$/,
        loader: 'string-replace-loader',
        options: {
          // search:'1234567',
          // replace:'9999'
          multiple: [
             { search: /'REPLACE_CIRCLES_WEBRTC_ENABLED_REPLACE'/, replace: (env.NAF_ADAPTER === 'socketio')?'false':'true', flags:'gmi'},
             { search: /'REPLACE_CIRCLES_MIC_ENABLED_REPLACE'/, replace: (env.NAF_AUDIO === true)?'true':'false', flags:'gmi'}
            ]
        }
      }
    ]
  },
  entry: './src/core/circles_client.js',
  target: 'web',
  devtool: "source-map",
  output: {
    filename: 'circles_client_bundle.min.js',
    path: path.resolve(__dirname, 'node_server/public/global/js/'),
  }
};