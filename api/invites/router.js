const router = require('express').Router();
const {
  validateInvite,
  validateType,
  checkGuestExists,
  checkPotluckExists,
  checkUserIsOwner,
  checkInviteExists,
  addInvite,
  getInvites
} = require('./middleware');

router.get('/', getInvites, ({invites}, res, next) => {
  res.json(invites);
});

const postMiddleware = [
  validateInvite, validateType, checkGuestExists, checkPotluckExists,
  checkUserIsOwner, checkInviteExists, addInvite
];

router.post('/', postMiddleware, ({added}, res, next) => {
  res.status(201).json(added);
});

module.exports = router;
