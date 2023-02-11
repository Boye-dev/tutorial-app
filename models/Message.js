// Import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    conversationId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
