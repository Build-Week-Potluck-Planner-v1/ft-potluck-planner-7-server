const db = require('../data/db-config');

exports.getByUsername = (username) => {
  return db('users')
    .where({username})
    .first();
};

exports.getById = (id) => {
  return db('users')
    .where({id})
    .first();
};

exports.add = (user) => {
  return db('users').insert(user, ['id', 'username'])
    .then(returnArray => {
      return returnArray[0];
    });
};
