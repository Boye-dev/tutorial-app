require("dotenv").config();
const express = require("express");
const { isStudentOrTutor } = require("../middleware/auth");
const router = express.Router();
const Tutor = require("../models/Tutor");
const Student = require("../models/Student");
const Space = require("../models/Space");
const Course = require("../models/Course");

//Post Space
router.post("/addSpace", isStudentOrTutor, async (req, res) => {
  const { userId, courseId, comment } = req.body;
  try {
    // Check if the userId belongs to a Tutor
    const tutor = await Tutor.findById(userId);
    console.log("tutor", tutor);

    if (tutor) {
      const newSpace = new Space({
        tutor: userId,
        courseId,
        comment,
      });
      await newSpace.save();
      return res.json({ space: newSpace });
    }

    // Check if the userId belongs to a Student
    const student = await Student.findById(userId);
    console.log("student", student);
    if (student) {
      const newSpace = new Space({
        student: userId,
        courseId,
        comment,
      });
      await newSpace.save();
      return res.json({ space: newSpace });
    }

    // If the userId does not belong to either a Tutor or a Student
    return res.status(400).json({ message: "Invalid userId" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Get All Spaces by course Id
router.get("/spaces/:courseId", isStudentOrTutor, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    const spaces = await Space.find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 })
      .populate("tutor")
      .populate("student")
      .populate({
        path: "replies",
        model: "Reply",
        populate: {
          path: "tutor",
          model: "Tutor",
        },
      })
      .populate({
        path: "replies",
        model: "Reply",
        populate: {
          path: "student",
          model: "Student",
        },
      });
    res.json({ spaces });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
