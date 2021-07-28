'use strict';

const router     = require('express').Router();
const path       = require('path');
const controller = require('../controllers/controller');
const roomController = require('../controllers/room');
const User       = require('../models/user');
const passport   = require('passport');

/**
 * Authenticated
 *
 * Using the `isAuthenticated()` check provided by PassportJS on the request
 * body, provide a middleware check for routes to ensrue they're authenticated
 * before proceeding.
 *
 */
const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  // Redirect to the home page
  return res.redirect('/');
};

/**
 * Not Authenticated
 *
 * A check method to ensure that a route is only accessible when *not*
 * authenticated. For example, a user should only be able to get to the login
 * route if they're not already authenticated.
 */
const notAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/explore');
  }

  return next();
};

//general web
router.get('/', notAuthenticated, (req, res) => {
  res.render(path.resolve(__dirname + '/../public/web/views/index'), {
    title: 'Welcome to CIRCLES'
  });
});

router.post('/login',  passport.authenticate('local', {
  successRedirect: '/explore',
  failureRedirect: '/'
}));

//magic links for students
router.get('/get-magic-links', authenticated, controller.getMagicLinks);

//token login
// router.get('/magic-login',
//   (req, res, next) => {
//     const { incorrectToken, token } = req.query;

//     if (token) {
//       next();
//     } else {
//       res.render('login', {
//         incorrectToken: incorrectToken === 'true',
//       })
//     }
//   },
//   passport.authenticate('jwt', {
//     successRedirect: '/explore',
//     failureRedirect: '/',
//   })
// );

router.get('/magic-login', function(req, res, next) {
  passport.authenticate('jwt', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect(req.query.route);
    });
  })(req, res, next);
});

// TODO: Get flash messages to work on login failure

// Ensure a user is authenticated before hitting logout
router.get('/logout', authenticated, (req, res, next) => {
  // Logout of Passport
  req.logout();

  // Redirect to home page
  res.redirect('/');
});

router.get('/register', notAuthenticated, controller.serveRegister);
router.get('/profile', authenticated, controller.serveProfile);
router.get('/explore', authenticated, controller.serveExplore);


//REST API (need to secure one day ... )
//inspired by https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd
router.route('/users/:username')
  .get(controller.getUser)
  .put(controller.updateUser)
  .delete(controller.deleteUser);

router.route('/users')
  .get(controller.getAllUsers);

router
  .get('/register', notAuthenticated, controller.serveRegister)
  .post(
    '/register',
    notAuthenticated,
    controller.registerUser,
    passport.authenticate('local', {
      successRedirect: '/explore',
      failureRedirect: '/'
    }));
router.post('/update-user', controller.updateUserInfo);

//TODO: this is a temporary fix. Sometime will have to add in ability for user to upload ....
router.get('/add-models-to-db', controller.addModel3Ds);
router.get('/add-users-to-db', controller.addUsers);
router.get('/add-all-test-data', controller.addAllTestData);

/**
 * Room Exploration
 *
 * This route will look for and load worlds by folder name and use the shared
 * room name of "explore". This will be a public room.
 */
router
  .get('/rooms/explore/world/:world_id', authenticated, controller.serveWorld);

// Room related routes
router
  .get('/rooms', authenticated, roomController.list)
  .post('/rooms', authenticated, roomController.processCreateForm);

// Room Editing
router
  .get('/rooms/:room_id/edit', authenticated, roomController.editForm)
  .post('/rooms/:room_id/edit', authenticated, roomController.processEditForm)
  .get('/rooms/:room_id/delete', authenticated, roomController.deleteConfirmation)
  .post('/rooms/:room_id/delete', authenticated, roomController.processDeleteConfirmation);

router.get('/invites', authenticated, roomController.serveInvites);

// Room Member Management
router
  .get('/rooms/:room_id/members', authenticated, roomController.membersPage)
  .post('/rooms/:room_id/invite', authenticated, roomController.processInviteForm)
  .post('/rooms/:room_id/invite/accept', authenticated, roomController.acceptInvite)
  .post('/rooms/:room_id/invite/reject', authenticated, roomController.rejectInvite)
  .post('/rooms/:room_id/members', authenticated, roomController.processMemberActions);

// Room Worlds
router
  .get('/rooms/:room_id/world/:world_id', authenticated, roomController.serveWorld);

// Serving relative links properly (this also means we can't use index.html) ...
router
  .get('/rooms/:room_id/world/:world_id/*', authenticated, controller.serveRelativeWorldContent);

// Lets Encrypt
router.get('/.well-known/acme-challenge/:challengeHash', controller.letsEncrypt);

module.exports = router;
