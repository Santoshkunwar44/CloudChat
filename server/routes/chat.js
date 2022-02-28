const {
  chatAccess,
  fetchChat,
  createGroupChat,
  renameChat,
  addUser,
  removeUser,
  deleteChat,
} = require("../controller/chatcontroller");
const protect = require("../middlewares/authmiddleware");

const router = require("express").Router();

// get the chat
router.route("/").post(protect, chatAccess);
router.route("/").get(protect, fetchChat);
router.route("/createGroupChat").post(protect, createGroupChat);
router.route("/rename").put(protect, renameChat);
router.route("/adduser").put(protect, addUser);
router.route("/removeuser").put(protect, removeUser);
router.route("/deletechat").put(protect, deleteChat);

module.exports = router;
