import knex from "./connection.js";

export class SportHall {
  constructor(id, name, description, schedule, imgURL) {
    // Проверка корректности параметра id
    // id может быть null или строкой определённого регулярным выражением формата
    if (!((id === null) || ((typeof id === "string") && (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))))) {
      throw Error('The "id" parameter is incorrect');
    }
    // Проверка корректности параметра name
    // Параметр name должен быть непустой строкой,
    // состоящей из символов только руссого или только английского алфавитов
    // Регистр букв игнорируется, так как корректируется перед присвоением значения полю name
    if (!((typeof name === "string") && (/^([a-z]+)|([а-яё]+)$/i.test(name)))) {
      throw Error('The "name" parameter is incorrect');
    }
    // Проверка корректности параметра description
    // Параметр description должен быть null или строкой
    if (!((description === null) || (typeof description === "string"))) {
      throw Error('The "description" parameter is incorrect');
    }
    // Проверка корректности параметра schedule
    // Параметр schedule должен быть null или object
    if (!((schedule === null) || (typeof schedule === "object"))) {
      throw Error('The "schedule" parameter is incorrect');
    }
    // Проверка корректности параметра imgURL
    // Параметр imgURL должен быть null или строкой, удовлетворяющей заданному регулярному выражению
    const URLRegex = /^\/images\/sport-hall-[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\.(jpg)|(png)$/;
    if (!((imgURL === null) || ((typeof imgURL === "string") && (URLRegex.test(imgURL))))) {
      throw Error('The "imgURL" parameter is incorrect');
    }

    this.id = id;
    this.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    this.description = description;
    this.schedule = schedule;
    this.imgURL = imgURL;
  }
}

export class SportHallModel {
  // Все экземпляры класса SportHall, хранящиеся в локальной коллекции,
  // должны иметь корректный id
  // Экземпляры класса SportHall, не хранящиеся в локальной коллекции,
  // также должны отсутствовать в БД и иметь поле id со значением null
  static all = [];

  static async load() {
    // При повторном вызове метода локальная коллекция очищается
    SportHallModel.all = [];
    const res = await knex("sportHalls").select();
    for (const obj of res) {
      SportHallModel.all.push(new SportHall(obj.id, obj.name, obj.description, obj.schedule, obj.imgURL));
    }
  }

  static findById(id) {
    const sportHall = SportHallModel.all.find(el => el.id === id);
    if (sportHall) {
      return sportHall;
    } else {
      return null;
    }
  }

  // Метод для добавления экземпляра класса SportHall в локальную коллекцию и таблицу БД
  // Если поле id добавляемого объекта имеет значение null, то после добавления объекта в БД
  // в данное поле будет записан сгенерированный БД id
  static async add(sportHall) {
    if (SportHallModel.all.includes(sportHall)) {
      return;
    }
    sportHall.id = (await knex("sportHalls").insert({
      name: sportHall.name,
      description: sportHall.description,
      schedule: sportHall.schedule,
      imgURL: sportHall.imgURL
    }).returning("id"))[0].id;
    SportHallModel.all.push(sportHall);
  }

  // Метод для обновления экземпляра класса SportHall в таблице БД
  static async update(sportHall) {
    if (!SportHallModel.all.includes(sportHall)) {
      return;
    }
    await knex("sportHalls").update({
      name: sportHall.name,
      description: sportHall.description,
      schedule: sportHall.schedule,
      imgURL: sportHall.imgURL
    }).where({id: sportHall.id});
  }

  // Метод для удаления экземпляра класса SportHall из локальной коллекции и таблицы БД
  // Полю id удалённого объекта присваивается значение null
  static async remove(sportHall) {
    if (!SportHallModel.all.includes(sportHall)) {
      return;
    }
    const ProgramModel = await import("../models/programModel.js");
    const programList = ProgramModel.ProgramModel.all.filter(el => el.sportHallId === sportHall.id);
    for (const program of programList) {
      await ProgramModel.ProgramModel.remove(program);
    }
    const index = SportHallModel.all.indexOf(sportHall);
    if (index !== -1) {
      SportHallModel.all.splice(index, 1);
    }
    await knex("sportHalls").delete().where({id: sportHall.id});
    sportHall.id = null;
  }

  static async removeById(id) {
    const sportHall = SportHallModel.all.find(el => el.id === id);
    if (sportHall) {
      await SportHallModel.remove(sportHall);
    }
  }
}

await SportHallModel.load();