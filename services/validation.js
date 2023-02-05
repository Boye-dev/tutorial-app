//ERROR HANDLING and VALIDATION

const { check, body, validationResult } = require("express-validator");
const {
  getUserByEmail,
  authenticateUserWithRole,
  getUserById,
} = require("./userWithRole");

const userWithRoleSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("email")
      .custom(async (value) => {
        let adminExist = await getUserByEmail(value);
        console.log("Exists? ", adminExist);
        if (adminExist[0] !== false) {
          console.log("The User already exists");
          return Promise.reject();
        }
      })
      .withMessage("Email is taken! If it belongs to you, please login!"),

    //First name and lastname is not null and is between 4-10 characters
    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("role", "Role is required").trim().notEmpty().isLength({ min: 3 }),
    //Email validation
    body("email", "Email is required").trim().notEmpty(),
    body("email", "Email must be valid containing @ and a domain (e.g .com)")
      .isEmail()
      .isLength({ min: 10 }),
    //Password validation
    body("password", "Password is required").trim().notEmpty(),
    body("confirmPassword", "Please enter your password again")
      .trim()
      .notEmpty(),
    check("confirmPassword")
      .custom((value, { req }) => {
        console.log("From Validator req body ", req.body);
        const { password } = req.body;
        if (value === password) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === password
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === password
          );
          return Promise.reject(); //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must be the same"),
    body("password")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const updateUserValidator = () => {
  return [
    //Check that email isn't taken
    check("email")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getUserByEmail(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "User's email didn't change. Still the same email for User. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The User already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another User with that email already exists."),

    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("role", "Role is required").trim().notEmpty().isLength({ min: 3 }),
    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("email", "Email is required").notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Email must be valid containing @ and a domain (e.g .com) ")
      .isLength({ min: 10 }),
  ];
};

const loginValidator = (req, res, next) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res
      .status(400)
      .json({ error: "Please Login with valid email and password" });
  } else {
    console.log("Details from Login form", req.body);
    next();
  }
};

const updateProductQuantityInCartValidator = (req, res, next) => {
  const { quantity } = req.body;
  if (!quantity) {
    return res.status(400).json({
      error: "Something went wrong.",
      actualError:
        "Please enter new quantity (Increased/Decreased count) for selected product. New Count/Quantity must not be 0",
      status: "NOT OK",
    });
  } else {
    next();
  }
};

const forgotPasswordValidator = (req, res, next) => {
  const { email } = req.body;
  if (!email || email.includes("@") === false) {
    return res.status(400).json({
      error: "Please enter your email! Email can't be empty and must be valid",
    });
  } else {
    console.log("Details from Login form", req.body);
    next();
  }
};

// For creating and editing products
const createProductValidator = () => {
  return [
    body("name", "Enter Product Name").trim().notEmpty(),
    body("description", "Enter Product Description - Not less than 10 words")
      .trim()
      .notEmpty()
      .isLength({ min: 20 }),
    body("price", "Enter Product Price").notEmpty(),
    body("unit", "Enter Available Product quantity").notEmpty(),
    body("category", "Enter Product Category/Brand").trim().notEmpty(),
  ];
};

const updatePasswordValidator = () => {
  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    //Check that current Password is correct
    check("currentPassword")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        const user = await getUserById(id);
        //An error of Incorrect Password would always be shown to the user if the getAdminById method returns false
        const { email } = user[1];

        let check = await authenticateUserWithRole(email, value);
        console.log("Check ", check);

        if (check[0] == false) {
          console.log("Current password is incorrect");
          return Promise.reject();
        }
      })
      .withMessage("Current Password is incorrect"),
    body("newPassword", "New password can not be empty").trim().notEmpty(),
    body("confirmNewPassword", "Please confirm new password").trim().notEmpty(),
    check("confirmNewPassword")
      .custom((value, { req }) => {
        console.log("FROM Validator req body", req.body);
        const { newPassword } = req.body;

        if (value === newPassword) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === newPassword
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === newPassword
          );
          return false;
          // return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must match!!"),
    check("confirmNewPassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const resetPasswordValidator = () => {
  return [
    body("newPassword", "New password can not be empty").trim().notEmpty(),
    body("confirmNewPassword", "Please confirm new password").trim().notEmpty(),
    check("confirmNewPassword")
      .custom((value, { req }) => {
        console.log("FROM Validator req body", req.body);
        const { newPassword } = req.body;
        if (value === newPassword) {
          console.log(
            "Passwords are the same.. Validation passed",
            value === newPassword
          );
          return true;
        } else {
          console.log(
            "Passwords must be the same.. Validation test failed",
            value === newPassword
          );
          return false;
          // return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
        }
      })
      .withMessage("Passwords must match!!"),
    check("confirmNewPassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "New Password must be strong - atleast 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  // errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  errors.array().map((err) => extractedErrors.push(err.msg));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userWithRoleSignupValidator,
  validate,
  loginValidator,
  createProductValidator,
  updatePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateUserValidator,
  updateProductQuantityInCartValidator,
};
