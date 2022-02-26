const {
  getNotification,
  postNotifications,
} = require("../controller/notification");
const protect = require("../middlewares/authmiddleware");

const router = require("express").Router();

router.route("/").get(protect, getNotification);
router.route("/").post(protect, postNotifications);

module.exports = router;
