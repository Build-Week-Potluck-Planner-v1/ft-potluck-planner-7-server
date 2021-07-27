const db = require('../data/db-config');

exports.getAll = () => {
  return db('foods');
};

exports.add = (food) => {
  return db('foods')
    .insert(food, ['id', 'name'])
    .then(([added]) => {
      return added;
    });
};
