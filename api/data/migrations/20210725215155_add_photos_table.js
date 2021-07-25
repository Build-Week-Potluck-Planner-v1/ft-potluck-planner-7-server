
exports.up = function(knex) {
  return knex.schema
    .createTable('photos', tbl => {
      tbl.increments();
      tbl.integer('potluck_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('potlucks')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      // figure out how to serve images
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('photos');
};
