import sha256 from "js-sha256";
import dotenv from "dotenv";
dotenv.config();

export async function up(knex) {
  await knex.schema.createTable("users", table => {
    table.uuid("id", {primaryKey: true}).defaultTo(knex.fn.uuid());
    table.string("login", 30).notNullable();
    table.string("passwordHash", 64).notNullable().checkRegex("^[A-Fa-f0-9]{64}$");
    table.integer("roleId").notNullable();
    table.foreign("roleId").references("roles.id");
    table.unique("login");
  });
  return knex("users").insert({
    login: process.env.ADMIN_LOGIN,
    passwordHash: sha256(process.env.ADMIN_PASSWORD),
    roleId: 1
  });
}

export function down(knex) {
  return knex.schema.dropTable("users");
}