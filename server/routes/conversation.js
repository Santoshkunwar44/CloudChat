const Conversation = require("../model/conversation");
const router = require("express").Router();

router.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const conversation = new Conversation({
      members: [senderId, receiverId],
    });
    const savedConversation = await conversation.save();
    res.status(200).send(savedConversation);
  } catch (err) {
    res.status(500).send(err);
  }
});

//get conversation of an user

router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;

// get the conversation of two users

router.get("/all/:userId1/:userId2", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $all: [req.params.userId1, req.params.userId2] },
    });
    res.status(200).send(conversation);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;

//$in
// The $in operator selects the documents where the value of a field equals any value in the specified array. To specify an $in expression,

// The $all operator selects the documents where the value of a field is an array that contains all the specified elements. To specify an $all expression, use the following prototype:

// { <field>: { $all: [ <value1> , <value2> ... ] } }
