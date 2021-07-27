
exports.up = function(knex) {
  return knex.schema
    .createTable('foods_potlucks', tbl => {
      tbl.increments();
      tbl.string('quantity', 256)
        .notNullable();
      tbl.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl.integer('food_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('foods')
        .onDelete('RESTRICT')
        .onUpdate('RESTRICT');
      tbl.integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('potlucks')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('foods_potlucks');
};
