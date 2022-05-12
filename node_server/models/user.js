'use strict';

//database
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type:       String,
    unique:     true,
    required:   true,
    trim:       true
  },
  usertype: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  },
  firstname: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  },
  lastname: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       true
  },
  email: {
    type:       String,
    unique:     true,
    required:   true,
    trim:       true
  },
  password: {
    type:       String,
    unique:     false,
    required:   true,
    trim:       false
  },
  gltf_head_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  gltf_hair_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  gltf_body_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  // gltf_hand_left_url: {
  //   type:       String,
  //   unique:     false,
  //   required:   false,
  //   trim:       true
  // },
  // gltf_hand_right_url: {
  //   type:       String,
  //   unique:     false,
  //   required:   false,
  //   trim:       true
  // },
  color_head: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_hair: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_body: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_hand_left: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  color_hand_right: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  }
});

// Verify password for this user
UserSchema.methods.validatePassword = function (password, callback) {
  // NOTE: "Function" method here is *needed* to ensure "this" is the current
  // user object, not the global context when within the compare callback. This
  // is a good example of when to use function vs fat arrows.
  bcrypt.compare(password, this.password, (err, result) => {
    if (result === true) {
      return callback(null, this);
    } else {
      console.log('authentication FAILED');
      return callback(err);
    }
  })
};

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
