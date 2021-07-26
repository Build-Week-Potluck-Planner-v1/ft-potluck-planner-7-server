const Potlucks = require('./model');

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

exports.validateType = (req, res, next) => {
  const {body: {name, date, time, location}} = req;
  const isString = (obj) => typeof obj === 'string';
  if ([name, date, time, location].map(isString).every(elem => !!elem)){
    next();
  } else {
    next({
      status: 400,
      message: 'name, date, time and location should all be strings'
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
