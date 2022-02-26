const router = require("express").Router();
const { sendMessage, getMessage } = require("../controller/messagecontroller");
const protect = require("../middlewares/authmiddleware");

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getMessage);

module.exports = router;
