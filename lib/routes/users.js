const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const User = require('../models/User');

const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

function setSessionCookies(res, token) {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });
}

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        setSessionCookies(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })
  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        setSessionCookies(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })
  .get('/verify', ensureAuth, (req, res, next) => {
    res.send(req.user)
    .catch(next);
  });