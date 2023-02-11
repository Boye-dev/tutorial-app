require("dotenv").config();
const express = require("express");
const router = express.Router();
// Auth Middleware
const { authorize, isAdmin, isActive } = require("../middleware/auth");
const {
  createStudent,
  getStudentById,
  updateStudent,
  updateStudentPassword,
  authenticateStudent,
} = require("../services/student");
const { translateError } = require("../services/mongo_helper");
const {
  studentSignupValidator,
  validate,
  updateStudentValidator,

  loginValidator,
  updateStudentPasswordValidator,
} = require("../services/validation");
const {
  upload,
  uploadProfilePicToCloudinary,
  updateProfilePicture,
} = require("../services/upload");

const Student = require("../models/Student");

let uploadProfileImageMiddleware = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
]);

//Create Student
router.post(
  "/student-signup",
  uploadProfileImageMiddleware,
  studentSignupValidator(),
  validate,
  async (req, res) => {
    console.log("signing up");
    try {
      console.log("Signup User");
      console.log("The req body ", req.body);

      const { firstname, lastname, username, phonenumber, email, password } =
        req.body;

      let studentObj = {
        firstname,
        lastname,
        username,
        phonenumber,
        email,
        password,
      };
      let files = req.files;

      // Check if images on the files property are existent
      let profilePhoto = files.profilePhoto
        ? files.profilePhoto[0].path
        : undefined;

      console.log(`Main Image Path ${profilePhoto}`);

      // To use Cloudinary
      let result1 = null;

      profilePhoto != undefined
        ? (result1 = await uploadProfilePicToCloudinary(profilePhoto))
        : (result1 = undefined);

      console.log(
        "The results from uploading the profilePic to cloudinary",
        result1
      );

      studentObj.profilePhoto = result1 && result1.url;

      // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
      studentObj.profilePhotoPublicCloudinaryId = result1 && result1.publicId;

      // To use local file path on disk storage
      // studentObj.profilePhoto = profilePhoto;

      console.log("The Student Object ", studentObj);

      const check = await createStudent(studentObj);
      console.log("The Student from DB", check);

      console.log(`Student created `, check);
      if (check[0] == true) {
        if (check[1].profilePhoto != undefined) {
          return res.status(201).json({
            message:
              "New Student Created successfully.Profile picture uploaded.",
            status: "OK",
            student: check[1],
          });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: check[1],
          status: "NOT OK",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: "Something went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);

/* Edit a Student */
router.put(
  "/editStudent/:id",
  uploadProfileImageMiddleware,
  updateStudentValidator(),
  validate,
  async (req, res) => {
    try {
      //Get Current User

      const { id } = req.params;
      let foundStudent = await getStudentById(id);

      if (foundStudent[0] !== false) {
        let files = req.files;

        let { firstname, lastname, username, phonenumber, email } = req.body;

        let studentObj = { firstname, lastname, username, phonenumber, email };

        console.log("Found Student -- ", foundStudent[1]);

        let foundStudentPublicId =
          foundStudent[1].profilePhotoPublicCloudinaryId !== undefined
            ? foundStudent[1].profilePhotoPublicCloudinaryId
            : "not_found";

        // Check if images on the files property are existent
        let profilePhoto = files.profilePhoto
          ? files.profilePhoto[0].path
          : undefined;

        // To use Cloudinary
        let result1 = null;

        profilePhoto != undefined
          ? (result1 = await updateProfilePicture(
              foundStudentPublicId,
              profilePhoto
            ))
          : (result1 = undefined);

        console.log(
          "The results from updating the profile phototo cloudinary (Deleting the old images and uploading the new ones)",
          result1
        );

        studentObj.profilePhoto = result1 && result1.url;

        // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
        studentObj.profilePhotoPublicCloudinaryId = result1 && result1.publicId;

        console.log("The Student Object ", studentObj);

        const check = await updateStudent(id, studentObj);
        //NB: We wont have any issue even if we have no pictures because the pictures used would still be the ones created Initially.
        console.log("The Updated Student from DB", check);
        if (check[0] !== false) {
          let updatedStudent = check[1];
          res.status(201).json({
            message: "Student updated successfully.",
            status: "OK",
            student: updatedStudent,
          });
        } else {
          return res
            .status(400)
            .json({ error: check[2], actualError: check[1], status: "NOT OK" });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: foundStudent[1],
          status: "NOT OK",
        });
      }
    } catch (error) {
      console.log(error);
      // return res.status(400).json({error: "Something Went wrong", actualError:translateError(error), status: "NOT OK" });
      return res.status(500).json({
        error: "Something Went wrong",
        actualError: translateError(error),
        status: "NOT OK",
      });
    }
  }
);

router.put(
  "/editStudent/password/:id",

  updateStudentPasswordValidator(),
  validate,
  async (req, res) => {
    let { id } = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;

    const tryUpdate = await updateStudentPassword(id, confirmNewPassword);
    console.log("Edit Student password  ", tryUpdate);
    if (tryUpdate[0] !== false) {
      res.json({ message: "Password updated successfully", status: "OK" });
    } else {
      return res.status(400).json({
        error: tryUpdate[2],
        actualError: tryUpdate[1],
        status: "NOT OK",
      });
    }
  }
);

router.post("/student-login", loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    let studentExists = await authenticateStudent(email, password);
    console.log("The student Exists ", studentExists);

    if (studentExists[0] == true) {
      studentExists = studentExists[1];

      //Create token
      const token = studentExists.token;
      //Save token in a cookie and send back to the frontend
      res.cookie("authToken", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
        httpOnly: true,
      });

      const { _id, firstname, lastname, username, email, role, profilePhoto } =
        studentExists;

      let student = {
        _id,
        firstname,
        lastname,
        username,
        email,
        role,
        profilePhoto,
      };

      console.log("The logged in student ", student);
      res
        .status(200)
        .json({ message: "student Login successful", status: "OK", student });
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: studentExists[1],
        status: "NOT OK",
      });
    }
  } catch (error) {
    //Catch block isn't needed as the Else block would handle the error if it isn't already handled by our middlewares
    console.log(error);
    return res.status(400).json({ error: "Something went wrong" });
  }
});

module.exports = router;
