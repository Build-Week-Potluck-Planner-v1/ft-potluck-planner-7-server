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

exports.getFoods = (potluck_id) => {
  return db('foods_potlucks')
    .where({potluck_id});
};

exports.addFoodRequest = (food_request) => {
  return db('foods_potlucks')
    .insert(food_request, ['id', 'food_id', 'potluck_id', 'user_id', 'quantity'])
    .then(([added]) => {
      return added;
    });
};

exports.getOwnerAndGuest = (potluck_id) => {
  return db('potlucks as p')
    .leftJoin('users_potlucks as up', 'p.id', 'up.potluck_id')
    .where('p.id', potluck_id)
    .select('owner_id', 'guest_id')
    .then(returnVal => {
      const returnSet = new Set();
      returnVal.forEach(elem => {
        returnSet.add(elem.owner_id);
        returnSet.add(elem.guest_id);
      });
      returnSet.delete(null);
      return returnSet;
    });
};
