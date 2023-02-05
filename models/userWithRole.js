// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserWithRoleSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    role: { type: String, required: true },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

const UserWithRole = mongoose.model("userWithRole", UserWithRoleSchema);

module.exports = UserWithRole;
