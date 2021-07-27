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

exports.getById = (id) => {
  return db('foods')
    .where({id})
    .first();
};

exports.getByName = (name) => {
  return db('foods')
    .where({name})
    .first();
};
