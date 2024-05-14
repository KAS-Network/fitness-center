import knex from "./connection.js";
import {TrainerModel} from "./trainerModel.js";
import {SportHallModel} from "./sportHallModel.js";

export class Program {
  constructor(id, name, trainerId, sportHallId, description, schedule, imgURL) {
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

    // Проверка корректности параметра trainerId
    // Параметр trainerId должен быть строкой
    // заданного регулярным выражением формата
    // и должен соответствовать реально существующему
    // в БД экземпляру класса Trainer
    if (!((typeof trainerId === "string") && (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(trainerId)) && (TrainerModel.findById(trainerId)))) {
      throw Error('The "trainerId" parameter is incorrect');
    }

    // Проверка корректности параметра sportHallId
    // Параметр sportHallId должен быть строкой
    // заданного регулярным выражением формата
    // и должен соответствовать реально существующему
    // в БД экземпляру класса SportHall
    if (!((typeof sportHallId === "string") && (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(sportHallId)) && (SportHallModel.findById(sportHallId)))) {
      throw Error('The "sportHallId" parameter is incorrect');
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
    const URLRegex = /^\/images\/program-[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\.(jpg)|(png)$/;
    if (!((imgURL === null) || ((typeof imgURL === "string") && (URLRegex.test(imgURL))))) {
      throw Error('The "imgURL" parameter is incorrect');
    }

    this.id = id;
    this.name = name;
    this.trainerId = trainerId;
    this.sportHallId = sportHallId;
    this.description = description;
    this.schedule = schedule;
    this.imgURL = imgURL;
  }
}

export class ProgramModel {
  // Все экземпляры класса Program, хранящиеся в локальной коллекции,
  // должны иметь корректный id
  // Экземпляры класса Program, не хранящиеся в локальной коллекции,
  // также должны отсутствовать в БД и иметь поле id со значением null
  static all = [];

  static async load() {
    // При повторном вызове метода локальная коллекция очищается
    ProgramModel.all = [];
    const res = await knex("programs").select();
    for (const obj of res) {
      ProgramModel.all.push(new Program(
        obj.id,
        obj.name,
        obj.trainerId,
        obj.sportHallId,
        obj.description,
        obj.schedule,
        obj.imgURL
      ));
    }
  }

  static findById(id) {
    const program = ProgramModel.all.find(el => el.id === id);
    if (program) {
      return program;
    } else {
      return null;
    }
  }

  // Метод для добавления экземпляра класса Program в локальную коллекцию и таблицу БД
  // Если поле id добавляемого объекта имеет значение null, то после добавления объекта в БД
  // в данное поле будет записан сгенерированный БД id
  static async add(program) {
    if (ProgramModel.all.includes(program)) {
      return;
    }
    program.id = (await knex("programs").insert({
      name: program.name,
      trainerId: program.trainerId,
      sportHallId: program.sportHallId,
      description: program.description,
      schedule: program.schedule,
      imgURL: program.imgURL
    }).returning("id"))[0].id;
    ProgramModel.all.push(program);
  }

  // Метод для обновления экземпляра класса Program в таблице БД
  static async update(program) {
    if (!ProgramModel.all.includes(program)) {
      return;
    }
    await knex("programs").update({
      name: program.name,
      trainerId: program.trainerId,
      sportHallId: program.sportHallId,
      description: program.description,
      schedule: program.schedule,
      imgURL: program.imgURL
    }).where({id: program.id});
  }

  // Метод для удаления экземпляра класса Program из локальной коллекции и таблицы БД
  // Полю id удалённого объекта присваивается значение null
  static async remove(program) {
    if (!ProgramModel.all.includes(program)) {
      return;
    }
    const index = ProgramModel.all.indexOf(program);
    if (index !== -1) {
      ProgramModel.all.splice(index, 1);
    }
    await knex("programs").delete().where({id: program.id});
    program.id = null;
  }

  static async removeById(id) {
    const program = ProgramModel.all.find(el => el.id === id);
    if (program) {
      await ProgramModel.remove(program);
    }
  }
}

await ProgramModel.load();
