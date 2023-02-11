/* General/Home route*/
require("dotenv").config();
const express = require("express");
const Student = require("../models/Student");
const router = express.Router();
// const { isAdmin, authorize, isActive } = require("../middleware/auth");
const Tutor = require("../models/Tutor");
router.get("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout Successful" });
});

router.get("/get-user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if the userId belongs to a Tutor
    const tutor = await Tutor.findById(userId);

    if (tutor) {
      return res.json(tutor);
    }

    // Check if the userId belongs to a Student
    const student = await Student.findById(userId);

    if (student) {
      return res.json(student);
    }

    // If the userId does not belong to either a Tutor or a Student
    return res.status(400).json({ message: "Invalid userId" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
