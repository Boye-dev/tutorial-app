require("dotenv").config();
const express = require("express");
const router = express.Router();
const Tutor = require("../models/Tutor");
const Student = require("../models/Student");
const Space = require("../models/Space");
const Reply = require("../models/Reply");
const { isStudentOrTutor } = require("../middleware/auth");

//POst reply
router.post("/reply/:spaceId", isStudentOrTutor, async (req, res) => {
  try {
    const { userId, comment } = req.body;
    const { spaceId } = req.params;

    // Check if the spaceId exists
    const space = await Space.findById(spaceId);
    if (!space) return res.status(400).json({ message: "Invalid spaceId" });

    // Check if the userId belongs to a Tutor
    const tutor = await Tutor.findById(userId);
    if (tutor) {
      const newReply = new Reply({
        tutor: userId,
        comment,
        spaceId,
      });
      await newReply.save();

      const space = await Space.findByIdAndUpdate(
        spaceId,
        { $push: { replies: newReply._id } },
        { new: true }
      );
      return res.json({ reply: newReply, space });
    }

    // Check if the userId belongs to a Student
    const student = await Student.findById(userId);
    if (student) {
      const newReply = new Reply({
        student: userId,
        comment,
        spaceId,
      });
      await newReply.save();

      const space = await Space.findByIdAndUpdate(
        spaceId,
        { $push: { replies: newReply._id } },
        { new: true }
      );
      return res.json({ reply: newReply, space });
    }

    // If the userId does not belong to either a Tutor or a Student
    return res.status(400).json({ message: "Invalid userId" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//Get all replies by space id
router.get("/reply/:spaceId", async (req, res) => {
  try {
    const space = await Space.findById(req.params.spaceId).populate("replies");
    if (!space) {
      return res.status(404).json({ error: "Space not found" });
    }

    const replies = space.replies;
    res.status(200).json({ replies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
