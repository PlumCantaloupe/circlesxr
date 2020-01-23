'use strict';

// TODO: Use momentJS to better format dates via getters

const mongoose = require('mongoose');
const md = require('jstransformer')(require('jstransformer-markdown-it'));
const sanitizeHtml = require('sanitize-html');

// Store extra data when we attach users to a room
const RoomMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: false
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  invite: {
    type: String,
    required: true,
    trim: true,
    enum: ['invited', 'accepted', 'rejected']
  },
  dateEmailSent: {
    type: Date,
    required: false,
    default: null
  },
  message: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated: {
    type: Date,
    default: null
  },
  inviteUpdated: {
    type: Date,
    default: null
  }
}, {
  strict: false
});

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated: {
    type: Date,
    default: null
  },
  members: [RoomMemberSchema]
});

RoomSchema.methods.formattedDescription = function() {
  // Run the description through a markdown processor
  const formattedText = md.render(this.description).body;

  // Return sanitized HTML since we need to output it raw in the Pug template
  return sanitizeHtml(formattedText, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6'
    ])
  });
}

RoomSchema.methods.isMember = function(user_id) {
  const existingMember = this.members.find(member => (member.user.equals(user_id) && member.invite === 'accepted'));

  if (existingMember) {
    return true;
  }

  return false;
}

RoomSchema.methods.isOwner = function(user_id) {
  return this.owner.equals(user_id);
}

const Room = mongoose.model('room', RoomSchema);
module.exports = Room;
