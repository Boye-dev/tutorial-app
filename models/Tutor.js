// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const TutorSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    phonenumber: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    role: { type: String, default: "Tutor" },
    profilePhoto: { type: String, required: true },
    profilePhotoPublicCloudinaryId: { type: String },
    areaOfSpecialty: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tutor = mongoose.model("Tutor", TutorSchema);

module.exports = Tutor;
