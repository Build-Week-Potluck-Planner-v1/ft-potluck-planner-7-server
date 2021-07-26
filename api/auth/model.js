const db = require('../data/db-config');

exports.getByUsername = (username) => {
  return db('users')
    .where({username})
    .first();
};
