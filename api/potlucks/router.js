const router = require('express').Router();
const {
  validatePotluck,
  validateType,
  addPotluck
} = require ('./middleware');

router.post('/', validatePotluck, validateType, addPotluck, (req, res, next) => {
  res.status(201).json(req.potluck);
});

module.exports = router;
