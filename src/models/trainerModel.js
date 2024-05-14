import knex from "./connection.js";

export class Trainer {
  static genderList = ["мужской", "женский"];

  constructor(id, lastName, firstName, patronymic, birthdate, gender, description, schedule, imgURL) {
    // Проверка корректности параметра id
    // id может быть null или строкой определённого регулярным выражением формата
    if (!((id === null) || ((typeof id === "string") && (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))))) {
      throw Error('The "id" parameter is incorrect');
    }

    // Проверка корректности параметра lastName
    // Параметр lastName должен быть непустой строкой,
    // состоящей из символов только руссого или только английского алфавитов
    // Регистр букв игнорируется, так как корректируется перед присвоением значения полю lastName
    if (!((typeof lastName === "string") && (/^([a-z]+)|([а-яё]+)$/i.test(lastName)))) {
      throw Error('The "lastName" parameter is incorrect');
    }

    // Проверка корректности параметра firstName
    // Параметр firstName должен быть непустой строкой,
    // состоящей из символов только руссого или только английского алфавитов
    // Регистр букв игнорируется, так как корректируется перед присвоением значения полю firstName
    if (!((typeof firstName === "string") && (/^([a-z]+)|([а-яё]+)$/i.test(firstName)))) {
      throw Error('The "firstName" parameter is incorrect');
    }

    // Проверка корректности параметра patronymic
    // Параметр patronymic должен быть null или непустой строкой,
    // состоящей из символов только руссого или только английского алфавитов
    // Регистр букв игнорируется, так как корректируется перед присвоением значения полю patronymic
    if (!((patronymic === null) || ((typeof patronymic === "string") && (/^([a-z]+)|([а-яё]+)$/i.test(patronymic))))) {
      throw Error('The "patronymic" parameter is incorrect');
    }

    // Проверка корректности параметра birthdate
    // Параметр birthdate должен являться экземпляром класса Date
    if(!(birthdate instanceof Date)) {
      throw Error('The "birthdate" parameter is incorrect');
    }

    // Проверка корректности параметра gender
    // Параметр gender должен быть строкой
    // и иметь значение "Мужской" или "Женский"
    if (!((typeof gender === "string") && (Trainer.genderList.includes(gender.toLowerCase())))) {
      throw Error('The "gender" parameter is incorrect');
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
    const URLRegex = /^\/images\/trainer-[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\.(jpg)|(png)$/;
    if (!((imgURL === null) || ((typeof imgURL === "string") && (URLRegex.test(imgURL))))) {
      throw Error('The "imgURL" parameter is incorrect');
    }

    this.id = id;
    this.lastName = lastName[0].toUpperCase() + lastName.slice(1).toLowerCase();
    this.firstName = firstName[0].toUpperCase() + firstName.slice(1).toLowerCase();
    this.patronymic = patronymic ? patronymic[0].toUpperCase() + patronymic.slice(1).toLowerCase() : null;
    this.birthdate = birthdate;
    this.gender = gender;
    this.description = description;
    this.schedule = schedule;
    this.imgURL = imgURL;
  }
}

export class TrainerModel {
  // Все экземпляры класса Trainer, хранящиеся в локальной коллекции,
  // должны иметь корректный id
  // Экземпляры класса Trainer, не хранящиеся в локальной коллекции,
  // также должны отсутствовать в БД и иметь поле id со значением null
  static all = [];

  static async load() {
    // При повторном вызове метода локальная коллекция очищается
    TrainerModel.all = [];
    const res = await knex("trainers").select();
    for (const obj of res) {
      TrainerModel.all.push(new Trainer(
        obj.id,
        obj.lastName,
        obj.firstName,
        obj.patronymic,
        obj.birthdate,
        obj.gender,
        obj.description,
        obj.schedule,
        obj.imgURL
      ));
    }
  }

  static findById(id) {
    const trainer = TrainerModel.all.find(el => el.id === id);
    if (trainer) {
      return trainer;
    } else {
      return null;
    }
  }

  // Метод для добавления экземпляра класса Trainer в локальную коллекцию и таблицу БД
  // Если поле id добавляемого объекта имеет значение null, то после добавления объекта в БД
  // в данное поле будет записан сгенерированный БД id
  static async add(trainer) {
    if (TrainerModel.all.includes(trainer)) {
      return;
    }
    trainer.id = (await knex("trainers").insert({
      lastName: trainer.lastName,
      firstName: trainer.firstName,
      patronymic: trainer.patronymic,
      birthdate: trainer.birthdate,
      gender: trainer.gender,
      description: trainer.description,
      schedule: trainer.schedule,
      imgURL: trainer.imgURL
    }).returning("id"))[0].id;
    TrainerModel.all.push(trainer);
  }

  // Метод для обновления экземпляра класса Trainer в таблице БД
  static async update(trainer) {
    if (!TrainerModel.all.includes(trainer)) {
      return;
    }
    await knex("trainers").update({
      lastName: trainer.lastName,
      firstName: trainer.firstName,
      patronymic: trainer.patronymic,
      birthdate: trainer.birthdate,
      gender: trainer.gender,
      description: trainer.description,
      schedule: trainer.schedule,
      imgURL: trainer.imgURL
    }).where({id: trainer.id});
  }

  // Метод для удаления экземпляра класса Trainer из локальной коллекции и таблицы БД
  // Полю id удалённого объекта присваивается значение null
  static async remove(trainer) {
    if (!TrainerModel.all.includes(trainer)) {
      return;
    }
    const ProgramModel = await import("../models/programModel.js");
    const programList = ProgramModel.ProgramModel.all.filter(el => el.trainerId === trainer.id);
    for (const program of programList) {
      await ProgramModel.ProgramModel.remove(program);
    }
    const index = TrainerModel.all.indexOf(trainer);
    if (index !== -1) {
      TrainerModel.all.splice(index, 1);
    }
    await knex("trainers").delete().where({id: trainer.id});
    trainer.id = null;
  }

  static async removeById(id) {
    const trainer = TrainerModel.all.find(el => el.id === id);
    if (trainer) {
      await TrainerModel.remove(trainer);
    }
  }
}

await TrainerModel.load();