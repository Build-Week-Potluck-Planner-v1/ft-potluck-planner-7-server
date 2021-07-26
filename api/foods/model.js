const db = require('../data/db-config');

exports.add = (food) => {
  return db('foods')
    .insert(food, ['id', 'name']);
};
