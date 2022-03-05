const router = require("express").Router();
const { OAuth2Client } = require("google-auth-library");
const User = require("../Models/user");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");
const client = new OAuth2Client(
  "573239136179-lmf02gf518d0ln93cj3up4vm6mrn8e4p.apps.googleusercontent.com"
);

router.post("/googleLogin", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "573239136179-lmf02gf518d0ln93cj3up4vm6mrn8e4p.apps.googleusercontent.com",
    });
    console.log(response);
    const { email, name, picture } = response.payload;
    let user = await User.findOne({ email });

    // if user

    if (user) {
      const { password, ...others } = user._doc;
      others.token = generateToken(others._id);
      return res.status(200).send(others);
    } else {
      //generating a hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(email + name, salt);

      // creating the alias for the new user
      const user = new User({
        userName: name,
        email: email,
        password: hashedPassword,
        pic: picture,
      });

      // saving the user in in DB  and respond
      const registeredUser = await user.save();
      const { password, ...others } = registeredUser._doc;
      others.token = generateToken(others._id);
      res.status(200).send(others);
    }
  } catch (err) {
    console.error(err);
  }
});

// router.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

// router.get(
//   "/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.cookie("mediaLogged", true);
//     res.redirect("http://localhost:3000/chatpage");
//   }
// );

// router.post("/logout", (req, res) => {
//   if (req.user) {
//     req.logout();
//     res.send("hey");
//     res.cookie.
//   } else {
//     throw new Error("failed");
//   }
// });

// router.get("/login/github/success", async (req, res) => {
//   try {
//     if (req.user) {
//       let loggedUser = req.user;
//       let gotUser;

//       let useremail = loggedUser.emails[0]?.value;
//       let customEmail = loggedUser.username + "@gmail.com";

//       let user = await User.findOne({
//         $or: [{ email: useremail }, { email: customEmail }],
//       });

//       if (!user) {
//         //generating a hashed password
//         let setEmail;
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(
//           useremail + loggedUser.username,
//           salt
//         );

//         if (useremail) {
//           setEmail = useremail;
//         } else {
//           setEmail = customEmail;
//         }

//         let newUser = {
//           userName: loggedUser.username,
//           pic: loggedUser.photos[0].value,
//           email: setEmail,
//           password: hashedPassword,
//         };

//         gotUser = await User.create(newUser);
//         const { password, ...others } = gotUser._doc;
//         others.token = generateToken(others._id);
//         console.log(others);
//         res.status(200).send({
//           success: true,
//           message: "successfull",
//           user: others,
//         });
//       } else {
//         const { password, ...others } = user._doc;
//         others.token = generateToken(others._id);
//         res.status(200).send({
//           success: true,
//           message: "successfull",
//           user: others,
//         });
//       }
//     } else {
//       res.status(500).send("server error");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// if user
// });

module.exports = router;
