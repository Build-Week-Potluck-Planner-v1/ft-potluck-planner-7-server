
exports.up = function(knex) {
  return knex.schema
    .createTable('users_potlucks', tbl => {
      tbl.increments();
      tbl.boolean('has_rsvped')
        .notNullable()
        .defaultTo(false);
      tbl.integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('potlucks')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl.integer('guest_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('users_potlucks');
};
