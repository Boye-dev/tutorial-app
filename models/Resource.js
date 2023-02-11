const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tutorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);
const Resource = mongoose.model("Resource", ResourceSchema);

module.exports = Resource;
