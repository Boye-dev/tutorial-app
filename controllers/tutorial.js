const express = require("express");
const Tutorial = require("../models/Tutorial");
const cron = require("node-cron");
const Course = require("../models/Course");
const { isTutor } = require("../middleware/auth");
const router = express.Router();

router.post("/tutorials", isTutor, async (req, res) => {
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    venue: req.body.venue,
    tutorId: req.body.tutorId,
    courseId: req.body.courseId,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
  });

  try {
    const savedTutorial = await tutorial.save();
    res.send(savedTutorial);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tutorials/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    const tutorials = await Tutorial.find({
      courseId: req.params.courseId,
    })
      .populate("tutorId")
      .sort({ date: 1 });
    res.send(tutorials);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.delete("/deleteTutorials", async (req, res) => {
  try {
    const deletedTutorial = await Tutorial.deleteMany({
      date: { $lt: new Date() },
    });
    res.send(deletedTutorial);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tutorials/:id", isTutor, async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).send({ error: "Tutorial not found" });
    }

    const deletedTutorial = await Tutorial.findByIdAndDelete(req.params.id);
    res.send(deletedTutorial);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
