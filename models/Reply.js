// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReplySchema = new Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tutor",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    comment: {
      type: String,
      required: true,
    },
    spaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
      required: true,
    },
  },
  { timestamps: true }
);

const Reply = mongoose.model("Reply", ReplySchema);

module.exports = Reply;
