const router = require('express').Router();
const {
  validateInvite,
  validateType,
  addInvite
} = require('./middleware');

router.post('/', validateInvite, validateType, addInvite, ({added}, res, next) => {
  res.status(201).json(added);
});

module.exports = router;
