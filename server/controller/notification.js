const asyncHandler = require("express-async-handler");
const notifications = require("../Models/notifications");

// FETCH NOTIFICATIONS
const getNotification = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    const notification = await notifications
      .find({
        users: { $in: [userId] },
      })
      .populate("message")
      .populate("users");
    res.status(200).send(notification);
  } catch (err) {
    console.log(err);
  }
});

// POST NOTIFICATIONS
const postNotifications = asyncHandler(async (req, res) => {
  const { message, users, typeOf } = req.body;

  const newNotification = new notifications({
    users,
    message,
    typeOf,
  });
  try {
    const notification = await newNotification.save();
    notification = await notification.populate("message").populate("users");
    res.status(2000).send(notification);
  } catch (err) {
    console.log(err);
  }
});

module.exports = { postNotifications, getNotification };
