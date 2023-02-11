require("dotenv").config();
const Tutor = require("../models/Tutor");
const { translateError } = require("./mongo_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Generate Password Salt and hash */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(13);
  console.log("The salt generated ", salt);
  return await bcrypt.hash(password, salt);
};

//Create Tutor
const createTutor = async ({
  firstname,
  lastname,
  username,
  phonenumber,
  email,
  password,
  profilePhoto,
  profilePhotoPublicCloudinaryId,
  areaOfSpecialty,
}) => {
  try {
    let tutor = new Tutor({
      firstname,
      lastname,
      username,
      phonenumber,
      email,
      password: await encryptPassword(password),
      profilePhoto,
      profilePhotoPublicCloudinaryId,
      areaOfSpecialty,
    });

    console.log("The Tutor Created ", tutor);

    //Create a  token
    const token = jwt.sign(
      { id: tutor._id, role: "Tutor" },
      process.env.JWT_SECRET
    );

    tutor.token = token;

    if (await tutor.save()) {
      return [true, tutor];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Return Tutor with specified iemail*/
const getTutorByEmail = async (email) => {
  const user = await Tutor.findOne({ email });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Tutor with that email doesn't exist"];
  }
};

/* Return Tutor with specified username*/
const getTutorByUsername = async (username) => {
  const user = await Tutor.findOne({ username });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "Tutor with that username doesn't exist"];
  }
};

// Delete Tutor
const deleteTutor = async (id) => {
  try {
    const user = await Tutor.findByIdAndDelete(id);
    if (!user) {
      throw new Error("Tutor not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

//Get Tutor by id
const getTutorById = async (id) => {
  try {
    const user = await Tutor.findById(id);
    if (user !== null) {
      return [true, user];
    } else {
      return [
        false,
        "Tutor doesn't exist. It is null and/or has been deleted.",
      ];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};

//Update Tutor Password
const updateTutorPassword = async (id, password) => {
  try {
    const userWithPassword = await Tutor.findByIdAndUpdate(
      id,
      { password: await encryptPassword(password) },
      { new: true }
    );
    if (userWithPassword !== null) {
      return [true, userWithPassword];
    } else {
      return [
        false,
        "Tutor with ID and Password does not exist. Tutor is null and/or has been deleted,",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error), "Something went wrong"];
  }
};

//Get All Tutors
const getAllTutors = async () => {
  try {
    const users = await Tutor.find({});
    if (!users) {
      throw new Error("Tutors not found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

//updateTutor

const updateTutor = async (id, fields) => {
  try {
    const updatedTutor = await Tutor.findByIdAndUpdate(id, fields, {
      new: true,
    });
    if (updatedTutor !== null) {
      return [true, updatedTutor];
    } else {
      return [
        false,
        "Tutor doesn't exist. It is null and/or has been deleted.",
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

/* Authenticate Tutor */
const authenticateTutor = async (email, password) => {
  const tutor = await Tutor.findOne({ email });

  if (tutor && (await bcrypt.compare(password, tutor.password))) {
    return [true, tutor];
  } else {
    return [false, "Incorrect email/password"];
  }
};

module.exports = {
  createTutor,
  encryptPassword,
  getTutorByUsername,
  getTutorByEmail,
  getAllTutors,
  deleteTutor,
  authenticateTutor,
  updateTutor,
  generateVerificationToken,
  decodeToken,
  getTutorById,
  updateTutorPassword,
};
