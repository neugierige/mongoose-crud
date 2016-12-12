// jshint node: true
'use strict';

const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name:
    {
      given: {
        type: String,
        required: true
      },
      surname: {
        type: String,
        required: true
      }
    },
    dob: {
      type: Date,
      required: true,
      match: /\d{4}-\d{2}-\d{2}/
    },
    gender: {
      type: String,
      enum: {
        values: ['f', 'm', 'n', 'o']
      },
      default: 'o'
    },
    height: {
      type: Number,
      unit: "pounds",
      required: true
    },
    weight: {
      type: Number,
      unit: "inches",
      required: true
    }
  },
  {
      toObject: { virtuals: true },
      toJSON: {virtuals: true},
      timestamps: true,
  }
);

personSchema.virtual('age').get(function() {
  let today = new Date();
  let thisYear = today.getFullYear();
  console.log("thisYear is ", this.dob.getFullYear());
  console.log("thisMonth is ", this.dob.getMonth());
  console.log("thisDate is ", this.dob.getDate());
  if (this.dob.getMonth() > today.getMonth() ||
    this.dob.getMonth() === today.getMonth() &&
    this.dob.getDate() >= today.getDate()) {
      thisYear -= 1;
    }
  return thisYear - this.dob.getFullYear();
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
