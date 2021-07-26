const Potlucks = require('./model');

const isString = (obj) => typeof obj === 'string';

exports.validatePotluck = (req, res, next) => {
  const {body: {name, date, time, location}} = req;
  if (name && date && time && location) {
    req.body = {name, date, time, location};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a name, date, time and location for the potluck'
    });
  }
};

exports.validatePut = (req, res, next) => {
  const {body: {date, time, location}} = req;
  if (date && time && location) {
    req.body = {date, time, location};
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a date, time and location for the potluck'
    });
  }
};

exports.validateType = (req, res, next) => {
  const {body: {name, date, time, location}} = req;
  if ([name, date, time, location].map(isString).every(elem => !!elem)){
    next();
  } else {
    next({
      status: 400,
      message: 'name, date, time and location should all be strings'
    });
  }
};

exports.validateTypePut = (req, res, next) => {
  const {body: {date, time, location}} = req;
  if([date, time, location].map(isString).every(elem => !!elem)) {
    next();
  } else {
    next({
      status: 400,
      message: 'date, time and location should all be strings'
    });
  }
};

exports.addPotluck = (req, res, next) => {
  const potluck = {
    ...req.body,
    owner_id: req.user.id,
  };

  Potlucks.add(potluck)
    .then(added => {
      req.potluck = added;
      next();
    })
    .catch(next);
};

exports.getPotlucks = (req, res, next) => {
  Potlucks.getByOwner(req.user.id)
    .then(potlucks => {
      req.potlucks = potlucks;
      next();
    })
    .catch(next);
};
