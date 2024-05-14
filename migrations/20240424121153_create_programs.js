export function up(knex) {
  return knex.schema.createTable("programs", table => {
    table.uuid("id", {primaryKey: true}).defaultTo(knex.fn.uuid());
    table.string("name", 30).notNullable();
    table.uuid("trainerId").notNullable();
    table.uuid("sportHallId").notNullable();
    table.text("description");
    table.jsonb("schedule");
    table.string("imgURL").checkRegex("^\/images\/program-[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\.(jpg)|(png)$");
    table.foreign("trainerId").references("trainers.id");
    table.foreign("sportHallId").references("sportHalls.id");
  });
}

export function down(knex) {
  return knex.schema.dropTable("programs");
}
