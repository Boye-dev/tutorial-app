// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ConversationSchema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
