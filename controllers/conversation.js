require("dotenv").config();
const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

const { isStudentOrTutor } = require("../middleware/auth");

router.post("/create-conversation", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/get-conversation/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/conversation/:convoId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.convoId);
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
