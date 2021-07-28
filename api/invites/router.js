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
  updateInvite,
  checkUserIsOwnerOrGuest,
  deleteInvite
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

router.put('/:id', putMiddleware, ({updated}, res, next) => {
  res.json(updated);
});

const deleteMiddleware = [
  checkInviteExistsPut, checkUserIsOwnerOrGuest, deleteInvite
];

router.delete('/:id', deleteMiddleware, ({deleted}, res, next) => {
  res.json(deleted);
});

module.exports = router;
