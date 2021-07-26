exports.validateFood = (req, res, next) => {
  const {body: {name}} = req;
  if (name) {
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a name for the food item'
    });
  }
};
