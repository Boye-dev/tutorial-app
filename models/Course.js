// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    level: { type: String, required: true },
    code: { type: String, required: true },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
