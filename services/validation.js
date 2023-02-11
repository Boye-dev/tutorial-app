//ERROR HANDLING and VALIDATION

const { check, body, validationResult } = require("express-validator");
const {
  getStudentByUsername,
  getStudentByEmail,
  getStudentById,
  authenticateStudent,
} = require("./student");
const {
  getTutorByUsername,
  getTutorByEmail,
  getTutorById,
  authenticateTutor,
} = require("./tutor");

const studentSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("username")
      .custom(async (value) => {
        let studentExist = await getStudentByUsername(value);
        console.log("Exists? ", studentExist);
        if (studentExist[0] !== false) {
          console.log("The Student already exists");
          return Promise.reject();
        }
      })
      .withMessage("Username is taken! If it belongs to you, please login!"),

    check("email")
      .custom(async (value) => {
        let studentExist = await getStudentByEmail(value);
        console.log("Exists? ", studentExist);
        if (studentExist[0] !== false) {
          console.log("The Student already exists");
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

    //Email validation
    body("email", "Email is required").trim().notEmpty(),
    body("email", "Email must be valid containing @ and a domain (e.g .com)")
      .isEmail()
      .isLength({ min: 10 }),

    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

    //Password validation
    body("password", "Password is required").trim().notEmpty(),
    body("confirmPassword", "Please enter your password again")
      .trim()
      .notEmpty(),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
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

const tutorSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("username")
      .custom(async (value) => {
        let studentExist = await getTutorByUsername(value);
        console.log("Exists? ", studentExist);
        if (studentExist[0] !== false) {
          console.log("The Tutor already exists");
          return Promise.reject();
        }
      })
      .withMessage("Username is taken! If it belongs to you, please login!"),

    check("email")
      .custom(async (value) => {
        let studentExist = await getTutorByEmail(value);
        console.log("Exists? ", studentExist);
        if (studentExist[0] !== false) {
          console.log("The Tutor already exists");
          return Promise.reject();
        }
      })
      .withMessage("Email is taken! If it belongs to you, please login!"),

    //First name and lastname is not null and is between 4-10 characters
    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

    //Email validation
    body("email", "Email is required").trim().notEmpty(),
    body("email", "Email must be valid containing @ and a domain (e.g .com)")
      .isEmail()
      .isLength({ min: 10 }),

    body("username", "Enter User Username")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),

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

const updateTutorValidator = () => {
  return [
    //Check that email isn't taken
    check("email")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getTutorByEmail(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Tutor's email didn't change. Still the same email for Tutor. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Tutor already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Tutor with that email already exists."),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    check("username")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getTutorByUsername(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Tutor's username didn't change. Still the same username for Tutor. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Tutor already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Tutor with that username already exists."),

    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
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
const updateStudentValidator = () => {
  return [
    //Check that email isn't taken
    check("email")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getStudentByEmail(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Student's email didn't change. Still the same email for Student. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Student already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Student with that email already exists."),
    body("phonenumber", "Please enter your Phone Number ").trim().notEmpty(),
    check("username")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        let userExist = await getStudentByUsername(value);
        console.log("Exists? ", userExist);
        if (userExist[1]._id == id) {
          console.log(
            "Student's username didn't change. Still the same username for Student. ",
            userExist[1]._id == id
          );
        }
        if (userExist[0] !== false && userExist[1]._id != id) {
          console.log("The Student already exists");
          return Promise.reject();
        }
      })
      .withMessage("Another Student with that username already exists."),

    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
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

const updateStudentPasswordValidator = () => {
  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    //Check that current Password is correct
    check("currentPassword")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        const user = await getStudentById(id);
        //An error of Incorrect Password would always be shown to the user if the getAdminById method returns false
        const { email } = user[1];

        let check = await authenticateStudent(email, value);
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

const updateTutorPasswordValidator = () => {
  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    //Check that current Password is correct
    check("currentPassword")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        const user = await getTutorById(id);
        //An error of Incorrect Password would always be shown to the user if the getAdminById method returns false
        const { email } = user[1];

        let check = await authenticateTutor(email, value);
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
  studentSignupValidator,
  tutorSignupValidator,
  validate,
  loginValidator,

  updateStudentPasswordValidator,
  updateTutorPasswordValidator,
  updateStudentValidator,
  updateTutorValidator,
};
