import dotenv from "dotenv";
dotenv.config();

export async function up(knex) {
  await knex.schema.createTable("fitnessCenters", table => {
    table.uuid("id", {primaryKey: true}).defaultTo(knex.fn.uuid());
    table.string("name", 30).notNullable();
    table.string("address", 100).notNullable();
    table.text("description");
    table.jsonb("schedule").notNullable();
  });
  return knex("fitnessCenters").insert({
    name: process.env.INFO_NAME,
    address: process.env.INFO_ADDRESS,
    description: process.env.INFO_DESCRIPTION,
    schedule: process.env.INFO_SCHEDULE
  });
}

export function down(knex) {
  return knex.schema.dropTable("fitnessCenters");
}