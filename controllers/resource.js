const express = require("express");
const { isTutor } = require("../middleware/auth");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const router = express.Router();

router.post("/resources", isTutor, async (req, res) => {
  try {
    const { link, description, tutorId, courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const resource = new Resource({
      link,
      description,
      tutorId,
      courseId,
    });

    await resource.save();
    res.status(201).json({ resource });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to get all resources by tutorId
router.get("/resources/tutor/:tutorId", async (req, res) => {
  try {
    const resources = await Resource.find({ tutorId: req.params.tutorId });
    if (!resources) {
      return res.status(404).json({ error: "No resources found" });
    }

    res.status(200).json({ resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a resource
router.delete("/resources/:id", isTutor, async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.status(200).json({ deletedResource });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/resources/:courseId", async (req, res) => {
  try {
    // Check if the course exists
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Get all resources associated with the course
    const resources = await Resource.find({ courseId: req.params.courseId })
      .populate("tutorId")
      .exec();
    res.json({ resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
