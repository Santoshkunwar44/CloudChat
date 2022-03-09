const router = require("express").Router();
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const protect = require("../middlewares/authmiddleware");
//LOGIN

// login
router.post("/login", async (req, res) => {
  try {
    //fetching the user with the email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      // compare the passoword if the user is found
      const validate = await bcrypt.compare(req.body.password, user.password);
      if (validate) {
        //send the other credentiasl other than the password
        const { password, ...others } = user._doc;
        others.token = generateToken(others._id);
        return res.status(200).send(others);
      } else {
        //return if the pw is wrong
        return res.status(401).send("Wrong Credentials");
      }
    } else {
      //if the email is not found
      return res.status(401).send("User not found");
    }
  } catch (err) {
    res.send(err);
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    //generating a hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // creating the alias for the new user
    const user = new User({
      userName: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      pic: req.body.pic,
    });

    // saving the user in in DB  and respond
    const registeredUser = await user.save();
    const { password, ...others } = registeredUser._doc;
    others.token = generateToken(others._id);
    res.status(200).send(others);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const saved = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.send(saved);
  } catch (err) {}
});

// get user
router.get("/", protect, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { userName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).send(users);
});

//follow user

router.post("/:id/follow", protect, async (req, res) => {
  const { userId } = req.body;
  var updatedUser;
  try {
    const loggedUser = await User.findById(userId);
    const nextUser = await User.findById(req.params.id);

    if (loggedUser._id === nextUser._id) {
      return res.status(401).send("You cannot follow yourself");
    }

    if (!loggedUser.followings.includes(nextUser._id)) {
      await nextUser.updateOne({ $push: { followers: userId } });
      updatedUser = await loggedUser.updateOne(
        {
          $push: { followings: nextUser._id },
        },
        { new: true }
      );
      res.status(200).json({ message: "followed successfully", updatedUser });
    } else {
      return res.status(401).send("You had already followed ");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// unfollow user

router.post("/:id/unfollow", protect, async (req, res) => {
  const { userId } = req.body;
  try {
    const loggedUser = await User.findById(userId);
    const nextUser = await User.findById(req.params.id);

    if (loggedUser._id === nextUser._id) {
      return res.status(401).send("You cannot unfollow yourself");
    }

    if (loggedUser.followings.includes(nextUser._id)) {
      await nextUser.updateOne({ $pull: { followers: userId } });
      await loggedUser.updateOne({ $pull: { followings: nextUser._id } });
      res.status(200).send("you unfollwed successfully");
    } else {
      return res.status(401).send("You had not  followed ");
    }
  } catch {
    res.status(500).send("Failed to unfollow the user ");
  }
});

router.get("/find/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    others.token = generateToken(others._id);
    res.status(200).send(others);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
router.put("/:id", protect, async (req, res) => {
  try {
    const user = User.findOneAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

// $or
