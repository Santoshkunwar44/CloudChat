const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chat");
const Message = require("../Models/Message");
const user = require("../Models/user");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.sendStatus(401);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let savedMessage = await Message.create(newMessage);
    savedMessage = await savedMessage.populate("sender", "name pic");

    savedMessage = await savedMessage.populate("chat");
    savedMessage = await user.populate(savedMessage, {
      path: "chat.users",
      select: "userName pic email",
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: savedMessage,
    });

    res.status(200).send(savedMessage);
  } catch (err) {
    throw new Error(err.message);
  }
});

const getMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({ chat: req.params.chatId })
      .populate("sender", "userName pic email")
      .populate("chat");

    res.status(200).send(message);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
});

module.exports = { sendMessage, getMessage };
