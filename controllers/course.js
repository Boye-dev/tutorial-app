require("dotenv").config();
const express = require("express");
const router = express.Router();
// Auth Middleware
const { translateError } = require("../services/mongo_helper");

const Course = require("../models/Course");

router.post("/create-course", async (req, res) => {
  function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const { name, level, code } = req.body;
  const course = new Course({ name, level, code, color: getRandomColor() });
  try {
    const newCourse = await course.save();
    res.status(201).json({
      success: true,
      data: newCourse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

//get course by level
router.get("/courses/:level", async (req, res) => {
  const { level } = req.params;
  try {
    const course = await Course.find({ level });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/courses", async (req, res) => {
  try {
    const course = await Course.find({});
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send("course not found");
    }
    res.send(course);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
