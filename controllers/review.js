require("dotenv").config();
const express = require("express");
const { isStudentOrTutor } = require("../middleware/auth");
const router = express.Router();
const Tutor = require("../models/Tutor");
const Student = require("../models/Student");
const Review = require("../models/Review");

//Get reviews by tutor id
//Post review by studentId and tutorId
//Check if studentId and tutorId is in the object
//if so Edit review Instead of post

router.post("/reviews", async (req, res) => {
  const review = new Review({
    tutorID: req.body.tutorID,
    studentID: req.body.studentID,
    rating: req.body.rating,
    review: req.body.review,
  });

  try {
    const savedReview = await review.save();
    res.status(201).send(savedReview);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/reviews/:id", async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId);

    if (!review) return res.status(404).send({ error: "Review not found" });

    if (req.body.rating) review.rating = req.body.rating;
    if (req.body.review) review.review = req.body.review;

    const updatedReview = await review.save();
    res.send(updatedReview);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/reviews/tutors/:tutorId", async (req, res) => {
  const tutorId = req.params.tutorId;

  try {
    const reviews = await Review.find({ tutorID: tutorId }).populate(
      "studentID"
    );
    res.send(reviews);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
module.exports = router;
