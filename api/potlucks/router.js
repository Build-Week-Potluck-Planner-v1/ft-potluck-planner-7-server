const router = require('express').Router();
const {
  validatePotluck,
  validateType,
  validateTypePut,
  addPotluck,
  getPotlucks,
  validatePut,
  checkPotluckExists,
  checkUserIsOwner,
  updatePotluck,
  getFoods
} = require ('./middleware');

router.get('/', getPotlucks, (req, res, next) => {
  res.json(req.potlucks);
});

router.post('/', validatePotluck, validateType, addPotluck, (req, res, next) => {
  res.status(201).json(req.potluck);
});

const putMiddleware = [
  validatePut, validateTypePut, checkPotluckExists, checkUserIsOwner, updatePotluck
];

router.put('/:id', putMiddleware, (req, res, next) => {
  res.json(req.updated);
});

router.get('/:potluck_id/foods', getFoods, ({foods}, res, next) => {
  res.json(foods);
});

module.exports = router;
