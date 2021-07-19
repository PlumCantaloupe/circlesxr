'use strict';

const path = require('path');
const Room = require('../models/room');
const validator = require('validator');
//const emailService = require('../services/email');
const fs = require('fs');

/**
 * Async Wrapper
 *
 * Helps prevent uncaught exceptions when using `async` functions to make use
 * of `await`.
 *
 * @link https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
 * @link http://thecodebarbarian.com/80-20-guide-to-async-await-in-node.js.html#error-handling
 *
 */
const asyncWrapper = require('express-async-handler');

/**
 * Room List and Creation form
 */
exports.list = asyncWrapper(async (req, res, next) => {
  // Get this user's rooms
  const ownedRooms = await req.user.getOwnedRooms();

  // Get the various invites a user may have
  const pendingInvites = await req.user.getPendingInvites();
  const acceptedInvites = await req.user.getAcceptedInvites();
  const rejectedInvites = await req.user.getRejectedInvites();
  const userRooms = await req.user.getAccessibleRooms();


  console.log('Pending Invites', pendingInvites);
  console.log('Accepted Invites', acceptedInvites);
  console.log('Rejected Invites', rejectedInvites);
  console.log('Owned Rooms', ownedRooms);

  res.render(path.resolve(__dirname + '/../public/web/views/rooms/list'), {
    title: 'Rooms',
    rooms: ownedRooms,
    userRooms: userRooms,
    pendingInvites: pendingInvites,
    acceptedInvites: acceptedInvites,
    rejectedInvites: rejectedInvites
  });
})

exports.serveInvites = asyncWrapper(async (req, res, next) => {
  // Get the various invites a user may have
  const pendingInvites = await req.user.getPendingInvites();
  const acceptedInvites = await req.user.getAcceptedInvites();
  const rejectedInvites = await req.user.getRejectedInvites();

  console.log('Pending Invites', pendingInvites);
  console.log('Accepted Invites', acceptedInvites);
  console.log('Rejected Invites', rejectedInvites);

  res.render(path.resolve(__dirname + '/../public/web/views/invites'), {
    title: 'Invites',
    pendingInvites: pendingInvites,
    acceptedInvites: acceptedInvites,
    rejectedInvites: rejectedInvites
  });
});

/**
 * Accept Invite
 */
exports.acceptInvite = asyncWrapper(async (req, res, next) => {
  const room = await Room.findOne({'_id': req.params.room_id}).exec();

  if (room) {
    room.members
      .filter(member => member.email === req.user.email)
      .forEach(member => {
        member.user = req.user;
        member.invite = 'accepted';
        member.inviteUpdated = Date.now();
      });

    await room.save();
  }

  return res.redirect('/rooms');
})

/**
 * Reject Invite
 */
exports.rejectInvite = asyncWrapper(async (req, res, next) => {
  const room = await Room.findOne({'_id': req.params.room_id}).exec();
  console.log(req.params);

  if (room) {
  room.members
    .filter(member => member.email === req.user.email)
    .forEach(member => {
      member.invite = 'rejected';
      member.inviteUpdated = Date.now();
    });

  await room.save();
  }

  return res.redirect('/rooms');
})

/**
 * Handle the submission of the create room form
 */
exports.processCreateForm = (req, res, next) => {
  if (!req.body) {
    return res.redirect('/rooms');
  }

  const roomData = {
    name: req.body.name,
    description: req.body.description,
    owner: req.user._id
  };

  // Create the room
  Room.create(roomData, (error, user) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Successfully created room");
    }

    // TODO: In messaging service, post message on success or failure
    return res.redirect('/rooms');
  });
}

/**
 * Room Edit Form
 *
 * Only accessible when authenticated and the owner of this room
 *
 * @param room_id
 */
exports.editForm = (req, res, next) => {
  // Load room by room ID AND owner, if there's no match, either the room ID
  // doesn't exist or the room isn't owned by the current user.
  Room.findOne({owner: req.user._id, _id: req.params.room_id}, (error, data) => {
    // Catch error, and redirect to 404
    if (error || !data) {
      return res.redirect('/rooms');
    }

    res.render(path.resolve(__dirname + '/../public/web/views/rooms/edit'), {
      title: 'Edit Room',
      room: data
    });
  });
}

/**
 * Process Edit Form
 *
 * Only accessible when authenticated and the owner of this room
 */
exports.processEditForm = (req, res, next) => {
  if (!req.body) {
    return res.redirect('/rooms');
  }

  // Build data to update
  const dataToUpdate = {
    name: req.body.name,
    description: req.body.description,
    updated: Date.now()
  };

  const updateOptions = {
    new: true,
    runValidators: true
  };

  // Find one and update, based on room ID and owner ID
  Room.findOneAndUpdate({ owner: req.user._id, _id: req.body.room_id }, dataToUpdate, updateOptions, (error, data) => {
    // Catch error, and redirect to 404
    if (error) {
      console.log(error);
      return res.sendStatus(500);
    }

    return res.redirect('/rooms');
  });
}

/**
 * Room Member Management Page
 *
 * From here, manage membership and invite new members
 */
exports.membersPage = (req, res, next) => {
  // Load room by room ID AND owner, if there's no match, either the room ID
  // doesn't exist or the room isn't owned by the current user.
  Room.findOne({owner: req.user._id, _id: req.params.room_id}, (error, data) => {
    if (error || !data) {
      // TODO: Show message
      return res.redirect('/rooms');
    }

    res.render(path.resolve(__dirname + '/../public/web/views/rooms/members'), {
      title: data.name + ' - Room Members',
      room: data,
    });
  });
}

/**
 * Process invite form
 *
 * Accepts an email, or comma separated list of emails and registers an invite
 * to a room. It can also accept a message which is used in the invite email
 *
 * NOTE: A user doesn't have to already be registered but if the email exists,
 * we should link the User object right away.
 */
exports.processInviteForm = asyncWrapper(async (req, res, next) => {
  if (!req.body) {
    return res.redirect('/rooms');
  }

  let room;

  // Try to load a room before doing anything as we can't do anything without it
  // Load the room based on ID and current user to ensure they own it
  try {
    room = await Room.findOne({owner: req.user._id, _id: req.params.room_id}).exec();
  } catch (error) {
    console.log('Room not found');
    return res.redirect('/rooms');
  }

  // Once we have a room, turn string of emails into array with processing done
  let emailsRaw = req.body.emails;

  // Replace new lines with commas
  emailsRaw = emailsRaw.replace(/\n/gm, ',');

  // Remove all whitespace
  emailsRaw = emailsRaw.replace(/\s/gm, '');

  // Remove duplicate commas
  emailsRaw = emailsRaw.replace(/,{2,}/gm, ',');

  // Split on comma
  const emailsArray = emailsRaw.split(',');

  // Remove invalid emails building the final set
  // Using a Set will also remove duplicates
  const emails = new Set();

  emailsArray.forEach(function(value) {
    // Only add to the final list of emails if it's a valid email
    if (validator.isEmail(value)) {
      emails.add(value);
    }
  });

  // Deal with the processed emails, creating invites
  emails.forEach(function(email) {
    // Only add the invite if there isn't one already for this email
    const existingInvite = room.members.find(member => member.email === email);

    if (!existingInvite) {
      // Build the invite
      let invite = {
        user: null,
        email: email,
        invite: 'invited',
        message: req.body.message ? req.body.message : null
      }

      // Add them to the room
      room.members.push(invite);
    }
  });

  // TODO: Add message that this worked

  // Save the invites to the room
  await room.save();

  // For return URL variable, make that better in that it only adds the
  // port if it's *not* 80
  let returnURL = env.SERVER_PROTOCOL + env.SERVER_URL;

  if (env.SERVER_PORT !== 80) {
    returnURL += ':' + env.SERVER_PORT;
  }

  const emailHeader = `
${req.user.firstname} ${req.user.lastname} has invited you to join them on CirclesXR in the room "${room.name}".

Please proceed to ${returnURL} and register!  Be sure to use the same email this invite was sent to. Once registred, your invite will be waiting for you to accept!`

  // Loop through members, sending the invites
  room.members
    .filter(member => member.dateEmailSent === null)
    .forEach(member => {

      // Append custom message which is stored on the member
      let customMessage = '';
      if (member.message) {
        customMessage = `

${req.user.firstname} ${req.user.lastname} included the following message:

${member.message}`
      }

      // Append signature
      const signature = `

--
Thanks,
CirclesXR Team`

      // Build final message content
      const messageBody = emailHeader + customMessage + signature;

      // Build the message object to send. Subject, message (with user
      // message). Keep it plain text for now in here
      const message = {
        subject: `You are invited to "${room.name}" on CirclesXR!`,
        text: messageBody
      };

      // Send off the email
      //emailService.send(member.email, message);

      // Store when the email was sent
      member.dateEmailSent = Date.now();
    });

  // Save all the updates to the room and members
  await room.save();
  return res.redirect('/rooms/' + room._id + '/members');
})

exports.processMemberActions = asyncWrapper(async (req, res, next) => {
  if (!req.body.action) {
    return res.redirect('/rooms');
  }

  let room;

  // Try to load a room before doing anything as we can't do anything without it
  // Load the room based on ID and current user to ensure they own it
  try {
    room = await Room.findOne({owner: req.user._id, _id: req.params.room_id}).exec();
  } catch (error) {
    console.log('Room not found');
    return res.redirect('/rooms');
  }

  console.log('processing member action', req.body);

  switch (req.body.action) {
    case 'delete-invite':
      // Remove the member from this room
      if (room.members.findIndex(member => member._id == req.body.member_id) !== -1) {
        room.members.id(req.body.member_id).remove();
      } else {
        // If there's no member, redirect back to members page
        return res.redirect('/rooms/' + room._id + '/members');
      }

      room.save(function (error) {
        if (error) {
          return handleerroror(error);
        }

        return res.redirect('/rooms/' + room._id + '/members#invited');
      });
      break;
    default:
      // Fallback to just redirecting to the member's page
      return res.redirect('/rooms/' + room._id + '/members');
  }
})

exports.deleteConfirmation = (req, res, next) => {
  // Load room by room ID AND owner, if there's no match, either the room ID
  // doesn't exist or the room isn't owned by the current user.
  Room.findOne({owner: req.user._id, _id: req.params.room_id}, (error, data) => {
    // Catch error, and redirect to 404
    if (error || !data) {
      return res.redirect('/rooms');
    }

    res.render(path.resolve(__dirname + '/../public/web/views/rooms/delete'), {
      title: 'Delete Room',
      room: data
    });
  });
}

exports.processDeleteConfirmation = asyncWrapper(async (req, res, next) => {
  // Load room by room ID AND owner, if there's no match, either the room ID
  // doesn't exist or the room isn't owned by the current user.
  const room = await Room.findOne({owner: req.user._id, _id: req.params.room_id}).exec();
  if (room) {
    await room.remove();
  }

  return res.redirect('/rooms');
})

/**
 * Serve Room Specific Worlds
 */
exports.serveWorld = asyncWrapper(async (req, res, next) => {

  //need to make sure we have the trailing slash to signify a folder so that relative links works correctly
  //https://stackoverflow.com/questions/30373218/handling-relative-urls-in-a-node-js-http-server 
  if (req.url.charAt(req.url.length - 1) !== '/') {
    res.writeHead(302, { "Location": req.url + "/" });
    res.end();
    return;
  }

  //get world name from path (will have to enforce standards in naming conventions later ...)
  const worldName = req.params.world_id;
  const user = req.user;
  const pathStr = path.resolve(__dirname + '/../public/worlds/' + worldName + '/index.html');

  // Load the room and validate access before anything else
  let room;
  try {
    room = await Room.findById(req.params.room_id).exec();
  } catch(error) {
    // If an error occured trying to load the room, rediret back
    return res.redirect('/profile');
  }

  // If no room was found, redirect back
  if (!room) {
    return res.redirect('/profile');
  }

  // If the current user is neither the owner or a member, redirect to the
  // profile page
  if (!room.isOwner(user._id) && !room.isMember(user._id)) {
    return res.redirect('/profile');
  }

  // Ensure the world file exists
  fs.readFile(pathStr, {encoding: 'utf-8'}, (error, data) => {
    if (error) {
      return res.redirect('/profile');
    }
    else {
      let result = data.replace(/__WORLDNAME__/g, worldName);
      result = result.replace(/__USERNAME__/g, user.username);

      result = result.replace(/__MODEL_HEAD__/g,  '/' + user.gltf_head_url);
      result = result.replace(/__MODEL_HAIR__/g,  '/' + user.gltf_hair_url);
      result = result.replace(/__MODEL_BODY__/g,  '/' + user.gltf_body_url);
      result = result.replace(/__COLOR_HEAD__/g,  user.color_head);
      result = result.replace(/__COLOR_HAIR__/g,  user.color_hair);
      result = result.replace(/__COLOR_BODY__/g,  user.color_body);
      result = result.replace(/__FACE_MAP__/g,    CIRCLES.CONSTANTS.DEFAULT_FACE_HAPPY_MAP);
      result = result.replace(/__USER_HEIGHT__/g, CIRCLES.CONSTANTS.DEFAULT_USER_HEIGHT);

      // Replace room name template string with the room ID
      result = result.replace(/__ROOM_NAME__/g, room._id);

      // Replace world links with rooms ID
      result = result.replace(/rooms\/explore/g, 'rooms/' + room._id);

      res.set('Content-Type', 'text/html');
      res.end(result); //not sure exactly why res.send doesn't work here ...
    }
  });
})
