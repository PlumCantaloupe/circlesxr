'use strict';

//database
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Room     = require('./room');

const UserSchema = new mongoose.Schema({
  username: {
    type:       String,
    unique:     true,
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
  gltf_hand_left_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
  gltf_hand_right_url: {
    type:       String,
    unique:     false,
    required:   false,
    trim:       true
  },
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
  },
  rooms: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
  }]
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

/**
 * Get this user's rooms
 *
 * This includes rooms they've created and ones they've joined
 */
UserSchema.methods.getAccessibleRooms = async function () {
  const ownedRooms = await this.getOwnedRooms();
  const joinedRooms = await this.getJoinedRooms();

  return ownedRooms.concat(joinedRooms);
}

UserSchema.methods.getOwnedRooms = function () {
  return Room.find({'owner': this._id }).sort('name asc').exec();
}

UserSchema.methods.getJoinedRooms = function () {
  return Room.find({'members.user': this._id }).sort('name asc').exec();
}

UserSchema.methods.getRoomsByEmail = function () {
  return Room.find({'members.email': this.email }).sort('name asc').exec();
}

UserSchema.methods.getPendingInvites = async function () {
  const roomsByEmail = await this.getRoomsByEmail();

  let pendingInvites = [];
  roomsByEmail.forEach(room => {
    pendingInvites = pendingInvites.concat(
      room.members
      .filter(member => (member.email === this.email && member.invite === 'invited'))
      .map(invite => {
        invite.room = room
        return invite;
      })
    );
  });

  return pendingInvites;
}

UserSchema.methods.getAcceptedInvites = async function () {
  const roomsByEmail = await this.getRoomsByEmail();

  let acceptedInvites = [];
  roomsByEmail.forEach(room => {
    acceptedInvites = acceptedInvites.concat(
      room.members
      .filter(member => (member.email === this.email && member.invite === 'accepted'))
      .map(invite => {
        invite.room = room
        return invite;
      })
    );
  });

  return acceptedInvites;
}

UserSchema.methods.getRejectedInvites = async function () {
  const roomsByEmail = await this.getRoomsByEmail();

  let rejectedInvites = [];
  roomsByEmail.forEach(room => {
    rejectedInvites = rejectedInvites.concat(
      room.members
      .filter(member => (member.email === this.email && member.invite === 'rejected'))
      .map(invite => {
        invite.room = room
        return invite;
      })
    );
  });

  return rejectedInvites;
}
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
