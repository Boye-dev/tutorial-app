require("dotenv").config();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../services/userWithRole");

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

/* Admin middleware - to verify that there is a logged in user and the user is an admin and not a regular user */
const isAdmin = (req, res, next) => {
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

    if (req.user.role !== "Admin") {
      return res
        .status(401)
        .json({ error: "Can't access this route, not an Admin." });
    } else {
      return next();
    }
  } catch (error) {
    console.log("Invalid Token ", error);
  }
  return next();
};
const isAdminOrStockManager = (req, res, next) => {
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

    if (req.user.role !== "StockManager" && req.user.role !== "Admin") {
      return res.status(401).json({
        error: "Can't access this route, not an Admin Or Stock Manager.",
      });
    } else {
      return next();
    }
  } catch (error) {
    console.log("Invalid Token ", error);
  }
  return next();
};
const isCashier = (req, res, next) => {
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

    if (req.user.role !== "Cashier") {
      return res
        .status(401)
        .json({ error: "Can't access this route, not a Cashier." });
    } else {
      return next();
    }
  } catch (error) {
    console.log("Invalid Token ", error);
  }
  return next();
};

const isActive = async (req, res, next) => {
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
    const userLog = await getUserById(req.user.id);
    console.log(userLog);
    if (userLog[0] === true) {
      if (userLog[1].status !== "Active") {
        return res
          .status(401)
          .json({ error: "Can't access this route,Account Not Active." });
      } else {
        return next();
      }
    }
  } catch (error) {
    console.log("Invalid Token ", error);
  }
  return next();
};

module.exports = {
  isAdmin,
  authorize,
  isCashier,
  isAdminOrStockManager,
  isActive,
};
