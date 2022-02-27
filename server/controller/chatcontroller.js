const asyncHandler = require("express-async-handler");
const Chat = require("../Models/chat");
const User = require("../Models/user");

const chatAccess = asyncHandler(async (req, res) => {
  // creating or fetching one a one chat

  //   get the receivers  _id

  const { userId } = req.body;
  if (!userId) {
    console.log("send the user params");
    res.sendStatus(400);
  }

  //   Check  if the chat between the two user is present
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  console.log("prev", isChat);

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "userName pic email",
  });
  console.log("after", isChat);
  //   if the chat is present send it
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //if not createnew one
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (err) {
      res.sendStatus(400);
      throw new Error(err.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    // finds the document if this _id exists in any users arrary field
    await Chat.find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (err) {
    res.sendStatus(400);
    throw Error("Some Error occured");
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).send({ message: "please Fill all the Fields" });
  }

  let users = JSON.parse(req.body.users);
  if (users < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group " });
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (err) {
    throw new Error(err.message);
  }
});

const renameChat = asyncHandler(async (req, res) => {
  const { chatName, chatId } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    throw new Error("Chat not found");
  } else {
    res.status(200).send(updateChat);
  }
});

const addUser = asyncHandler(async (req, res) => {
  const { chatid, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatid,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.sendStatus(400);
    throw new Error("Chat not found");
  } else {
    res.status(200).send(added);
  }
});

const removeUser = asyncHandler(async (req, res) => {
  console.log("your are here");
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).send({ message: "succesfully removed the user " });
});

module.exports = {
  chatAccess,
  fetchChat,
  createGroupChat,
  renameChat,
  addUser,
  removeUser,
};
