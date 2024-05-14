import knex from "./connection.js";

const roles = await knex("roles").select();

export class User {
  constructor(id = null, login, passwordHash, roleId) {
    if (id && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) {
      throw Error("Некорректный id");
    }
    if (login.length === 0 || login.length > 30) {
      throw Error("Некорректный логин");
    }
    if (!/^[a-f0-9]{64}$/i.test(passwordHash)) {
      throw Error("Некорректный хэш пароля");
    }
    if (!(roleId in roles.map(el => el.id))) {
      throw Error("Некорректный roleId");
    }

    this.id = id;
    this.login = login;
    this.passwordHash = passwordHash;
    this.roleId = roleId;
    this.role = roles.find(el => el.id === roleId).name;
  }

  static async getUserByLogin(login) {
    const res = (await knex("users").select().where({login}))[0];
    try {
      const user = new User(
        res.id,
        res.login,
        res.passwordHash,
        res.roleId
      );
      return user;
    } catch (err) {
      return null;
    }
  }

  static async getUserById(id) {
    const res = (await knex("users").select().where({id}))[0];
    try {
      return new User(
        res.id,
        res.login,
        res.passwordHash,
        res.roleId
      );
    } catch (err) {
      return null;
    }
  }
}