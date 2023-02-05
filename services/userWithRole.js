require("dotenv").config();
const UserWithRole = require("../models/userWithRole");
const { translateError } = require("./mongo_helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* Generate Password Salt and hash */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(13);
  console.log("The salt generated ", salt);
  return await bcrypt.hash(password, salt);
};

/* Create new Admin */
const createUserWithRole = async ({
  firstname,
  lastname,
  username,
  email,
  password,
  role,
}) => {
  try {
    let userWithRole = new UserWithRole({
      firstname,
      lastname,
      username,
      email,
      password: await encryptPassword(password),
      role,
    });

    console.log("The User Created ", userWithRole);

    //Create a  token
    const token = jwt.sign(
      { id: userWithRole._id, role: userWithRole.role },
      process.env.JWT_SECRET
    );

    userWithRole.token = token;

    if (await userWithRole.save()) {
      return [true, userWithRole];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/* Authenticate Admin */
const authenticateUserWithRole = async (email, password) => {
  const userWithRole = await UserWithRole.findOne({ email });

  if (userWithRole && (await bcrypt.compare(password, userWithRole.password))) {
    return [true, userWithRole];
  } else {
    return [false, "Incorrect email/password"];
  }
};

/* Return admin with specified id */
const getUserById = async (id) => {
  try {
    const user = await UserWithRole.findById(id);
    if (user !== null) {
      return [true, user];
    } else {
      return [false, "User doesn't exist. It is null and/or has been deleted."];
    }
  } catch (error) {
    console.log(translateError(error));
    return [false, translateError(error)];
  }
};
/* Return admin with specified iemail*/
const getUserByEmail = async (email) => {
  const user = await UserWithRole.findOne({ email });

  if (user !== null) {
    return [true, user];
  } else {
    return [false, "User with that email doesn't exist"];
  }
};

/* Update Admin profile */
const updateUser = async (id, fields) => {
  try {
    const user = await UserWithRole.findByIdAndUpdate(
      id,
      { $set: fields },
      {
        new: true,
      }
    );
    if (user !== null) {
      return [true, user];
    } else {
      return [
        false,
        "User doesn't exist. User is null and/or has been deleted.",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    return [false, translateError(error), "Something went wrong"];
  }
};
const deactivateUser = async (id, fields) => {
  try {
    const user = await UserWithRole.findByIdAndUpdate(
      id,
      { $set: fields },
      {
        new: true,
      }
    );
    if (user !== null) {
      return [true, user];
    } else {
      return [
        false,
        "User doesn't exist. User is null and/or has been deleted.",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    return [false, translateError(error), "Something went wrong"];
  }
};

/* Update Admin Password */
const updateUserPassword = async (id, password) => {
  try {
    const userWithPassword = await UserWithRole.findByIdAndUpdate(
      id,
      { password: await encryptPassword(password) },
      { new: true }
    );
    if (userWithPassword !== null) {
      return [true, userWithPassword];
    } else {
      return [
        false,
        "User with ID and Password does not exist. User is null and/or has been deleted,",
        "Something went wrong.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error), "Something went wrong"];
  }
};

// Delete User
const deleteUser = async (id) => {
  try {
    const user = await UserWithRole.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

//Get All Users
const getAllUsers = async () => {
  try {
    const users = await UserWithRole.find({});
    if (!users) {
      throw new Error("Users not found");
    }
    return users;
  } catch (error) {
    throw error;
  }
};

/* Get the current url */
//NB: NODE_ENV specifies the environment in which an application is running

module.exports = {
  createUserWithRole,
  encryptPassword,
  authenticateUserWithRole,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserPassword,

  deleteUser,
  getAllUsers,
  deactivateUser,
};
