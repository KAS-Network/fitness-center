import knex from "./connection.js";

export class FitnessCenter {
  static info = null;

  constructor(id, name, address, description, schedule) {
    if (id && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) {
      throw Error("Некорректный id");
    }
    if (!name) {
      throw Error("Имя не может быть пустым");
    }
    this.id = id;
    this.name = name;
    this.address = address || "";
    this.description = description || "";
    this.schedule = schedule || {};
  }

  static async getInfo() {
    if (!FitnessCenter.info) {
      const res = (await knex("fitnessCenters").select())[0];
      FitnessCenter.info = new FitnessCenter(
        res.id,
        res.name,
        res.address,
        res.description,
        res.schedule
      );
    }
    return FitnessCenter.info;
  }

  static async save() {
    if (FitnessCenter.info) {
      await knex("fitnessCenters").where({id: FitnessCenter.info.id}).update(FitnessCenter.info);
    }
  }
}