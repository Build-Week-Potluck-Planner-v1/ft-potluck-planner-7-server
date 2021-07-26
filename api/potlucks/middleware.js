exports.validatePotluck = ({body: {name, date, time, location}}, res, next) => {
  if (name && date && time && location) {
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a name, date, time and location for the potluck'
    });
  }
};
