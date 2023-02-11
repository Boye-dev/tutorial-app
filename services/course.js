require("dotenv").config();
const Course = require("../models/Course");
const { translateError } = require("./mongo_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Create new Student */
const createCourse = async ({ name, level, code }) => {
  try {
    let course = new Course({
      name,
      level,
      code,
    });

    console.log("The Course Created ", course);

    if (await course.save()) {
      return [true, course];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

module.exports = {
  createCourse,
};
