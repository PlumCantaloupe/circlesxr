'use strict';

//database
const mongoose  = require('mongoose');

const Model3DSchema = new mongoose.Schema({
  name: {
    type:       String,
    unique:     true,
    required:   true,
    trim:       true
  },
  url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  type: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  },
  format3D: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  }
});

const Model3D = mongoose.model('model3D', Model3DSchema);
module.exports = Model3D;
