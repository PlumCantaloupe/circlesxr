'use strict';
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

// Set up and parse Environment based configuation
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const fs = require('fs');

let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

//read in parts content to insert
let circles_header           =  fs.readFileSync('./src/webpack.worlds.parts/circles_header.part.html', 'utf8');
let circles_scene_properties =  fs.readFileSync('./src/webpack.worlds.parts/circles_scene_properties.part.html', 'utf8');
let circles_assets           =  fs.readFileSync('./src/webpack.worlds.parts/circles_assets.part.html', 'utf8');
let circles_avatar           =  fs.readFileSync('./src/webpack.worlds.parts/circles_avatar.part.html', 'utf8');
let circles_end_scripts      =  fs.readFileSync('./src/webpack.worlds.parts/circles_end_scripts.part.html', 'utf8');

//now insert vars
// Enusure Janus URL's set
// if (env.JANUS_SERVER === undefined) {
//   throw 'Missing JANUS_SERVER url in .env';
// }

// const janusServerRegex = new RegExp(/\{\{(\s+)?JANUS_SERVER(\s+)?\}\}/, 'gmi');
// circles_scene_properties = circles_scene_properties.toString().replace(janusServerRegex,  env.JANUS_SERVER);

const nafAudioRegex   = new RegExp(/\{\{(\s+)?NAF_AUDIO(\s+)?\}\}/, 'gmi');
const nafAdapterRegex = new RegExp(/\{\{(\s+)?NAF_ADAPTER(\s+)?\}\}/, 'gmi');
const nafServerRegex  = new RegExp(/\{\{(\s+)?NAF_SERVER(\s+)?\}\}/, 'gmi');

//insert env vars into parts
circles_scene_properties = circles_scene_properties.toString().replace(nafAudioRegex,  env.NAF_AUDIO);
circles_scene_properties = circles_scene_properties.toString().replace(nafAdapterRegex,  env.NAF_ADAPTER);
circles_scene_properties = circles_scene_properties.toString().replace(nafServerRegex,  env.NAF_SERVER);

module.exports = {
  entry: function() {
    return {};
  },
  output: {
    path: path.resolve(__dirname, 'node_server/public/worlds')
  },
  performance: {
    hints: false
  },
  plugins: [
    new CleanWebpackPlugin([
      'node_server/public/worlds'
    ], {
      verbose: true
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/worlds',
        to: './',
        transform (content, path) {
          if (path.endsWith('.html')) {
            //insert new parts
            content = content.toString();
            content = content.replace(/<circles-start-scripts(\s+)?\/>/i, circles_header);
            content = content.replace(/<a-scene(\s+)?circles_properties(\s+)?>/i, circles_scene_properties);
            content = content.replace(/<circles-assets(\s+)?\/>/i, circles_assets);
            content = content.replace(/<circles-avatar(\s+)?\/>/i, circles_avatar);
            content = content.replace(/<circles-end-scripts(\s+)?\/>/i, circles_end_scripts);
            //return content.toString().replace(janusServerRegex, env.JANUS_SERVER);
            return content;
          } else {
            return content;
          }
        }
      }
    ])
  ]
}
