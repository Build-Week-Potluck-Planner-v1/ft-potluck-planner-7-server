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
      message: 'Name and location should be strings, date should be an iso date string'
    });
  }
};

exports.addPotluck = (req, res, next) => {
  potluck = {
    ...req.body,
    owner_id: req.user.id,
  };

  console.log(potluck.date);
  Potlucks.add(potluck)
    .then(potluck => {
      console.log(potluck);
      next();
    })
    .catch(next);
};