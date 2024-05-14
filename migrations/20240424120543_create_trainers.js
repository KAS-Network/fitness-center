export function up(knex) {
  return knex.schema.createTable("trainers", table => {
    table.uuid("id", {primaryKey: true}).defaultTo(knex.fn.uuid());
    table.string("lastName", 30).notNullable().checkRegex("^([A-Z][a-z]*)|([А-ЯЁ][а-яё]*)$");
    table.string("firstName", 30).notNullable().checkRegex("^([A-Z][a-z]*)|([А-ЯЁ][а-яё]*)$");
    table.string("patronymic", 30).checkRegex("^([A-Z][a-z]*)|([А-ЯЁ][а-яё]*)$");
    table.date("birthdate").notNullable();
    table.string("gender", 7).notNullable().checkIn(["Мужской", "Женский"]);
    table.text("description");
    table.jsonb("schedule");
    table.string("imgURL").checkRegex("^\/images\/trainer-[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\.(jpg)|(png)$");
  });
}

export function down(knex) {
  return knex.schema.dropTable("trainers");
}