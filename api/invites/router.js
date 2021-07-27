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
  validateTypePut
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

router.put('/:id', validatePut, validateTypePut, (req, res, next) => {
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
