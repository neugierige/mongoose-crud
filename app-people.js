// jshint node: true
'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mongoose-crud');
const db = mongoose.connection;

const Person = require('./models/person.js');

const done = function() {
  db.close();
};

const create = function(givenName, surname, dob, gender, height, weight) {
  Person.create({
    'name.given': givenName,
    'name.surname': surname,
    dob: dob,
    gender: gender,
    height: height,
    weight: weight
  })
  .then(function(person) {
    console.log(person);
  })
  .catch(console.error)
  .then(done);
};

const index = function() {
  // let search = {};
  Person.find()
  .then(function(people) {
    people.forEach(function(person) {
      console.log(person.toJSON());
    });
  })
  .catch(console.error)
  // .catch((err) => {
  //   console.error();
  // })
  .then(done);
};

const show = function(id) {
  Person.findById(id)
  .then(function(person) {
    console.log(person.toJSON());
  })
  .catch(console.error)
  .then(done);
};

const update = function(id, field, value) {
  // validates field and value
  let newObject = {};
  newObject[field] = value;

  Person.findById(id)
  .then(function(person) {
    person[field] = value;
    return person.save();
  })
  .then(function(person) {
    console.log(person.toJSON());
  })
  .catch(console.error)
  .then(done);
};

const destroy = function(id) {
  Person.findById(id)
  .then(function(person) {
    console.log(person.toJSON());
    return person.remove();
    // why doesn't .deleteOne() work here?
  })
  .catch(console.error)
  .then(done);
};

db.once('open', function() {
  let command = process.argv[2];

  // Using more than once, avoiding jshint complaints
  let field;
  let id;

  switch (command) {
    case 'create':
      let givenName = process.argv[3];
      let surname = process.argv[4];
      let dob =  process.argv[5];
      let gender =  process.argv[6];
      let height = process.argv[7];
      let weight = process.argv[8];
      if (true || givenName) {
        create(givenName, surname, dob, gender, height, weight);
      } else {
        console.log('usage c <given_name> <surname> <date of birth> [gender], <height>, <weight>');
        done();
      }
      break;

    case `show`:
      id = process.argv[3];
      show(id);
      break;

    case 'update':
      id = process.argv[3];
      field = process.argv[4];
      let value = process.argv[5];
      update(id, field, value);
      break;

    case 'destroy':
      id = process.argv[3];
      destroy(id);
      break;

    default:
      index();
      break;
  }

});
