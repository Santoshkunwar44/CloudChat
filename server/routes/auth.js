const User = require("../model/user");
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    //generating a hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // creating the alias for the new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // saving the user in in DB  and respond
    const registeredUser = await user.save();
    res.status(200).send({ success: true, registeredUser });
  } catch (err) {
    res.send(err);
  }
});


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

module.exports = router;
