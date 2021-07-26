const bcrypt = require('bcryptjs');
const Users = require('./model');
const jwt = require('jsonwebtoken');
const {
  jwtSecret
} = require('./secret');

exports.validateBody = (req, res, next) => {
  const { username, password } = req.body;
  if ( username && password ) {
    req.body = { username, password };
    next();
  } else {
    next({
      status: 400,
      message: 'Please provide a username and password'
    });
  }
};

exports.validateType = ({ body: { username, password } }, res, next) => {
  if ( typeof username === 'string' && typeof password === 'string' ) {
    next();
  } else {
    next({
      status: 400,
      message: 'Username and password must both be strings'
    });
  }
};

exports.checkUsernameFree = ({ body: { username, password } }, res, next) => {
  Users.getByUsername(username)
    .then(user => {
      if (user) {
        next({
          status: 400,
          message: 'Username already exists'
        });
      } else {
        next();
      }
    })
    .catch(next);
};

exports.checkUsernameExists = (req, res, next) => {
  const {username} = req.body;
  Users.getByUsername(username)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        next({
          status: 400,
          message: "Username doesn't exist"
        });
      }
    })
    .catch(next);
};


exports.hashPassword = (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 8);
  next();
};

exports.addUser = (req, res, next) => {
  const { username, password } = req.body;
  Users.add({ username, password })
    .then(newUser => {
      req.newUser = newUser;
      next();
    })
    .catch(next);
};

exports.validateCredentials = ({user, body: {password}}, res, next) => {
  passwordValid = bcrypt.compareSync(password, user.password);
  if (passwordValid) {
    next();
  } else {
    next({
      status: 400,
      message: 'Invalid Credentials'
    });
  }
};

exports.generateToken = (req, res, next) => {
  const payload = {
    id: req.user.id,
    username: req.user.username
  };
  const options = {
    expiresIn: '1d'
  };
  req.token = jwt.sign(payload, jwtSecret, options);
  next();
};
