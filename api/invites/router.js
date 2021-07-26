const router = require('express').Router();
const {
  validateInvite,
  validateType,
  checkGuestExists,
  addInvite
} = require('./middleware');

const postMiddleware = [
  validateInvite, validateType, checkGuestExists, addInvite
];

router.post('/', postMiddleware, ({added}, res, next) => {
  res.status(201).json(added);
});

module.exports = router;
