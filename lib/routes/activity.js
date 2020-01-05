const { Router } = require('express');
const Activity = require('../models/Activity');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
    .post('/', ensureAuth, (req, res, next) => {
        Activity
        .create(req.body)
        .then(activity => {
            return Activity
            .findByIdAndUpdate(activity._id, { userId: req.user._id }, { new: true });
        })
        .then(activity => res.send(activity))
        .catch(next);
    })
    .get('/', ensureAuth, (req, res, next) => {
        Activity
        .find({ userId: req.user._id })
        .then(activities => res.send(activities))
        .catch(next);
    })