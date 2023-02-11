require("dotenv").config();
const express = require("express");
const router = express.Router();
// Auth Middleware
const { authorize, isActive } = require("../middleware/auth");
const {
  createTutor,
  getTutorById,
  updateTutor,
  updateTutorPassword,
  authenticateTutor,
} = require("../services/tutor");
const { translateError } = require("../services/mongo_helper");
const {
  validate,
  tutorSignupValidator,
  updateTutorValidator,
  loginValidator,
  updateTutorPasswordValidator,
} = require("../services/validation");
const {
  upload,
  uploadProfilePicToCloudinary,
  updateProfilePicture,
} = require("../services/upload");

const Tutor = require("../models/Tutor");
const Review = require("../models/Review");

let uploadProfileImageMiddleware = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
]);

//Create Tutor
router.post(
  "/tutor-signup",
  uploadProfileImageMiddleware,
  tutorSignupValidator(),
  validate,
  async (req, res) => {
    console.log("signing up");
    try {
      console.log("Signup User");
      console.log("The req body ", req.body);

      const {
        firstname,
        lastname,
        username,
        phonenumber,
        email,
        password,
        areaOfSpecialty,
      } = req.body;

      let tutorObj = {
        firstname,
        lastname,
        username,
        phonenumber,
        email,
        password,
        areaOfSpecialty,
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

      tutorObj.profilePhoto = result1 && result1.url;

      // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
      tutorObj.profilePhotoPublicCloudinaryId = result1 && result1.publicId;

      // To use local file path on disk storage
      // productObj.profilePhoto = profilePhoto;

      console.log("The Tutor Object ", tutorObj);

      const check = await createTutor(tutorObj);
      console.log("The Tutor from DB", check);

      console.log(`Tutor created `, check);
      if (check[0] == true) {
        if (check[1].profilePhoto != undefined) {
          return res.status(201).json({
            message: "New Tutor Created successfully.Profile picture uploaded.",
            status: "OK",
            Tutor: check[1],
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

/* Edit a Tutor */
router.put(
  "/editTutor/:id",
  uploadProfileImageMiddleware,
  updateTutorValidator(),
  validate,
  async (req, res) => {
    try {
      //Get Current User

      const { id } = req.params;
      let foundTutor = await getTutorById(id);

      if (foundTutor[0] !== false) {
        let files = req.files;

        let {
          firstname,
          lastname,
          username,
          phonenumber,
          email,

          areaOfSpecialty,
        } = req.body;

        let tutorObj = {
          firstname,
          lastname,
          username,
          phonenumber,
          email,

          areaOfSpecialty,
        };

        console.log("Found Tutor -- ", foundTutor[1]);

        let foundTutorPublicId =
          foundTutor[1].profilePhotoPublicCloudinaryId !== undefined
            ? foundTutor[1].profilePhotoPublicCloudinaryId
            : "not_found";

        // Check if images on the files property are existent
        let profilePhoto = files.profilePhoto
          ? files.profilePhoto[0].path
          : undefined;

        // To use Cloudinary
        let result1 = null;

        profilePhoto != undefined
          ? (result1 = await updateProfilePicture(
              foundTutorPublicId,
              profilePhoto
            ))
          : (result1 = undefined);

        console.log(
          "The results from updating the profile phototo cloudinary (Deleting the old images and uploading the new ones)",
          result1
        );

        tutorObj.profilePhoto = result1 && result1.url;

        // To save the public Ids of each of the image which we can later use for updating and deleting images from cloudinary
        tutorObj.profilePhotoPublicCloudinaryId = result1 && result1.publicId;

        console.log("The Tutor Object ", tutorObj);

        const check = await updateTutor(id, tutorObj);
        //NB: We wont have any issue even if we have no pictures because the pictures used would still be the ones created Initially.
        console.log("The Updated Tutor from DB", check);
        if (check[0] !== false) {
          let updatedTutor = check[1];
          res.status(201).json({
            message: "Tutor updated successfully.",
            status: "OK",
            Tutor: updatedTutor,
          });
        } else {
          return res
            .status(400)
            .json({ error: check[2], actualError: check[1], status: "NOT OK" });
        }
      } else {
        return res.status(422).json({
          error: "Something went wrong.",
          actualError: foundTutor[1],
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
router.get("/tutor-courses/:id", async (req, res) => {
  try {
    const tutorId = req.params.id;
    const tutor = await Tutor.findById(tutorId).populate("areaOfSpecialty");
    if (!tutor) {
      return res.status(404).send("Tutor not found");
    }

    const reviews = await Review.find({ tutorID: tutorId });
    const totalRatings = reviews.reduce((acc, cur) => acc + cur.rating, 0);
    const avgRating = reviews.length ? totalRatings / reviews.length : 0;

    res.send({ ...tutor.toObject(), avgRating });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
router.get("/course-tutors/:courseId", async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const tutors = await Tutor.find({
      areaOfSpecialty: { $in: [courseId] },
    })
      .sort({ rating: -1 })
      .populate("areaOfSpecialty");

    // Use the map method to calculate the average of ratings for each tutor
    const tutorData = tutors.map(async (tutor) => {
      // Find all the reviews for this tutor
      const reviews = await Review.find({ tutorID: tutor._id });
      // Calculate the average of the ratings field
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          : 0;

      // Add the average rating to the tutor data
      return {
        ...tutor.toObject(),
        avgRating,
      };
    });

    // Wait for all the tutor data to be calculated
    const tutorDataWithAvgRating = await Promise.all(tutorData);
    res.json(tutorDataWithAvgRating);
  } catch (error) {
    res.status(500).json({ error });
  }
});
router.put(
  "/editTutor/password/:id",

  updateTutorPasswordValidator(),
  validate,
  async (req, res) => {
    let { id } = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;

    const tryUpdate = await updateTutorPassword(id, confirmNewPassword);
    console.log("Edit Tutor password  ", tryUpdate);
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

router.post("/tutor-login", loginValidator, async (req, res) => {
  try {
    const { email, password } = req.body;
    let tutorExists = await authenticateTutor(email, password);
    console.log("The tutor Exists ", tutorExists);

    if (tutorExists[0] == true) {
      tutorExists = tutorExists[1];

      //Create token
      const token = tutorExists.token;
      //Save token in a cookie and send back to the frontend
      res.cookie("authToken", token, {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours
        httpOnly: true,
      });

      const { _id, firstname, lastname, username, email, role, profilePhoto } =
        tutorExists;

      let tutor = {
        _id,
        firstname,
        lastname,
        username,
        email,
        role,
        profilePhoto,
      };

      console.log("The logged in tutor ", tutor);
      res
        .status(200)
        .json({ message: "tutor Login successful", status: "OK", tutor });
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: tutorExists[1],
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
