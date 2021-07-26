const db = require('../data/db-config');

exports.getByOwner = (owner_id) => {
  return db('potlucks')
    .where({owner_id});
};

exports.add = (potluck) => {
  return db('potlucks')
    .insert(potluck, ['id', 'owner_id', 'name', 'date', 'time', 'location'])
    .then(([added]) => {
      return added;
    });
};
