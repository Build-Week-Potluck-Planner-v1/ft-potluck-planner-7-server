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
  updatePotluck
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
  next({
    status: 404,
    message: 'Not implemented'
  });
});

module.exports = router;
