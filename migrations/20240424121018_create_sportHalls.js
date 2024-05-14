export function up(knex) {
  return knex.schema.createTable("sportHalls", table => {
    table.uuid("id", {primaryKey: true}).defaultTo(knex.fn.uuid());
    table.string("name", 30).notNullable().checkRegex("^([А-ЯЁ][а-яё]*)|([A-Z][a-z]*)$");
    table.text("description");
    table.jsonb("schedule");
    table.string("imgURL").checkRegex("^\/images\/sport-hall-[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\.(jpg)|(png)$");
  });
}

export function down(knex) {
  return knex.schema.dropTable("sportHalls");
}