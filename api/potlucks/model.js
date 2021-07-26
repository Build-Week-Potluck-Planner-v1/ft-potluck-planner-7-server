const db = require('../data/db-config');

exports.getByOwner = (owner_id) => {
  return db('potlucks')
    .where({owner_id});
};

exports.getById = (id) => {
  return db('potlucks')
    .where({id})
    .first();
};

exports.add = (potluck) => {
  return db('potlucks')
    .insert(potluck, ['id', 'owner_id', 'name', 'date', 'time', 'location'])
    .then(([added]) => {
      return added;
    });
};

exports.getByIdAndOwner = (id, owner_id) => {
  return db('potlucks')
    .where({id, owner_id})
    .first();
};

exports.update = (id, potluck) => {
  return db('potlucks')
    .where({id})
    .update(potluck, ['id', 'owner_id', 'name', 'date', 'time', 'location']);
};
