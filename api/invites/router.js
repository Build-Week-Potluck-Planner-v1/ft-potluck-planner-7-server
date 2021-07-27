const router = require('express').Router();
const {
  validateInvite,
  validateType,
  checkGuestExists,
  checkPotluckExists,
  checkUserIsOwner,
  checkInviteExists,
  addInvite,
  getInvites,
  validatePut,
  validateTypePut,
  checkInviteExistsPut,
  checkUserIsGuest,
  updateInvite
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

const putMiddleware = [
  validatePut, validateTypePut, checkInviteExistsPut, checkUserIsGuest,
  updateInvite
];

router.put('/:id', putMiddleware, (req, res, next) => {
  res.json(req.updated);
});

module.exports = router;
