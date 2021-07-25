exports.validateBody = ({body: {username, password}}, res, next) => {
  if (username && password) {
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a username and password'
    });
  }
};
