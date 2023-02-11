const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    tutorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
    studentID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
