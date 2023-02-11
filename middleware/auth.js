require("dotenv").config();
const jwt = require("jsonwebtoken");
// const { getUserById } = require("../services/userWithRole");

/* VerifyToken method - Checks that a user is logged in */
const verifyToken = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      error:
        "Cannot access this route because a token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("THE DECODED", decoded);
    req.user = decoded;
  } catch (err) {
    console.log("Invalid Token", err);
  }
  return next();
};

/* Assign verifyToken method to the variable name authorize. (i.e Creating a middleware function called authorize which is just the verifyToken method) */
const authorize = verifyToken;

/* Tutor middleware - to verify that there is a logged in user and the user is an Tutor and not a regular user */
const isTutor = (req, res, next) => {
  const token =
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      error:
        "Cannot access this route because a token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("THE DECODED ", decoded);
    req.user = decoded;

    if (req.user.role !== "Tutor") {
      return res
        .status(401)
        .json({ error: "Can't access this route, not an Tutor." });
    } else {
      return next();
    }
  } catch (error) {
    console.log("Invalid Token ", error);
  }
  return next();
};
const isStudentOrTutor = (req, res, next) => {
  const token =
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      error:
        "Cannot access this route because a token is required for authentication",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("THE DECODED ", decoded);
    req.user = decoded;

    if (req.user.role !== "Student" && req.user.role !== "Tutor") {
      return res.status(401).json({
        error: "Can't access this route, not a Student Or Tutor .",
      });
    } else {
      return next();
    }
  } catch (error) {
    console.log("Invalid Token ", error);
  }
  return next();
};

module.exports = {
  isTutor,
  authorize,
  isStudentOrTutor,
};
