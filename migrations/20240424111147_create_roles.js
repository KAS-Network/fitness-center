export async function up(knex) {
  await knex.schema.createTable("roles", table => {
    table.integer("id").primary();
    table.string("name", 10).notNullable().checkIn(["admin", "user"]);
  });
  return knex("roles").insert([
    {id: 1, name: "admin"},
    {id: 2, name: "user"}
  ]);
}

export function down(knex) {
  return knex.schema.dropTable("roles");
}