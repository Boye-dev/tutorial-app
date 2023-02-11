require("dotenv").config();
const Student = require("../models/Student");
const { translateError } = require("./mongo_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Generate Password Salt and hash */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(13);
  console.log("The salt generated ", salt);
  return await bcrypt.hash(password, salt);
};

/* Create new Student */
const createStudent = async ({
  firstname,
  lastname,
  username,
  phonenumber,
  email,
  password,
  profilePhoto,
  profilePhotoPublicCloudinaryId,
}) => {
  try {
    let student = new Student({
      firstname,
      lastname,
      username,
      phonenumber,
      email,
      password: await encryptPassword(password),
      profilePhoto,
      profilePhotoPublicCloudinaryId,
    });

    console.log("The Student Created ", student);

    //Create a  token
    const token = jwt.sign(
      { id: student._id, role: "Student" },
      process.env.JWT_SECRET
    );

    student.token = token;

    if (await student.save()) {
      return [true, student];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Return student with specified iemail*/
const getStudentByEmail = async (email) => {
  const user = await Student.findOne({ email });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Student with that email doesn't exist"];
  }
};

/* Return student with specified username*/
const getStudentByUsername = async (username) => {
  const user = await Student.findOne({ username });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Student with that username doesn't exist"];
  }
};

/* Authenticate Student */
const authenticateStudent = async (email, password) => {
  const student = await Student.findOne({ email });

  if (student && (await bcrypt.compare(password, student.password))) {
    return [true, student];
  } else {
    return [false, "Incorrect email/password"];
  }
};

//Get student by id
const getStudentById = async (id) => {
  try {
    const user = await Student.findById(id);
    if (user !== null) {
      return [true, user];
    } else {
      return [
        false,
        "Student doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

//Update Student Password
const updateStudentPassword = async (id, password) => {
  try {
    const userWithPassword = await Student.findByIdAndUpdate(
      id,
      { password: await encryptPassword(password) },
      { new: true }
    );
    if (userWithPassword !== null) {
      return [true, userWithPassword];
    } else {
      return [
        false,
        "Student with ID and Password does not exist. Student is null and/or has been deleted,",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error), "Something went wrong"];
  }
};

// Delete Student
const deleteStudent = async (id) => {
  try {
    const user = await Student.findByIdAndDelete(id);
    if (!user) {
      throw new Error("Student not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

//Get All Students
const getAllStudents = async () => {
  try {
    const users = await Student.find({});
    if (!users) {
      throw new Error("Students not found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

//updateStudent

const updateStudent = async (id, fields) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(id, fields, {
      new: true,
    });
    if (updatedStudent !== null) {
      return [true, updatedStudent];
    } else {
      return [
        false,
        "Student doesn't exist. It is null and/or has been deleted.",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    return [false, translateError(error), "Something went wrong."];
  }
};

const generateVerificationToken = (id) => {
  console.log("The user id passed into the jwt generate method", id);
  const verificationToken = jwt.sign(
    { id: id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  console.log("Generated verification token ", verificationToken);
  return verificationToken;
};

const decodeToken = (token) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );
    return [true, payload];
  } catch (error) {
    return [false, error];
  }
};

module.exports = {
  createStudent,
  encryptPassword,
  getStudentByUsername,
  getStudentByEmail,
  getAllStudents,
  deleteStudent,
  authenticateStudent,
  updateStudent,
  generateVerificationToken,
  decodeToken,
  getStudentById,
  updateStudentPassword,
};
