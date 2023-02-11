// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    phonenumber: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    role: { type: String, default: "Student" },
    profilePhoto: { type: String, required: true },
    profilePhotoPublicCloudinaryId: { type: String },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
