const router = require("express").Router();
const Message = require("../model/message");

// send the message
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const message = await newMessage.save();
    res.status(200).send(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get the message

router.get("/:conversationId", async (req, res) => {
  try {
    const message = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).send(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
