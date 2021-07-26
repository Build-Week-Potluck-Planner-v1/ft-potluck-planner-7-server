const router = require('express').Router();
const {
  validatePotluck,
  validateType,
  addPotluck,
  getPotlucks
} = require ('./middleware');

router.get('/', getPotlucks, (req, res, next) => {
  res.json(req.potlucks);
});

router.post('/', validatePotluck, validateType, addPotluck, (req, res, next) => {
  res.status(201).json(req.potluck);
});

module.exports = router;
