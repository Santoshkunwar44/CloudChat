const User = require("../model/user");
const router = require("express").Router();

router.post("/:id/follow", async (req, res) => {
  //check is the current user and the next user is not same | the user cannot follow thyself
  if (req.body.userId !== req.params.id) {
    try {
      //fetch the document of an current user and the next user
      const user = await User.findById(req.params.id);
      const currUser = await User.findById(req.body.userId);

      //check if the current user already follows the user |
      if (!user.followers.includes(currUser._id)) {
        // push the currUser's id in the followers array of the user's document
        await user.updateOne({ $push: { followers: currUser._id } });
        // push the user's id in the followings  array of the current user's document
        await currUser.updateOne({ $push: { followings: user._id } });
        return res
          .status(200)
          .send({ success: true, message: "Successfully followed" });
      } else {
        res.status(401).send("You have already followed this user");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(401).send("You cannot follow yourself");
  }
});

// unfollowing the user

router.post("/:id/unfollow", async (req, res) => {
  //check is the current user and the next user is not same | the user cannot follow thyself
  if (req.body.userId !== req.params.id) {
    try {
      //fetch the document of an current user and the next user
      const user = await User.findById(req.params.id);
      const currUser = await User.findById(req.body.userId);

      //check if the current user already follows the user |
      if (user.followers.includes(currUser._id)) {
        // push the currUser's id in the followers array of the user's document
        await user.updateOne({ $pull: { followers: currUser._id } });
        // push the user's id in the followings  array of the current user's document
        await currUser.updateOne({ $pull: { followings: user._id } });
        return res
          .status(200)
          .send({ success: true, message: "Successfully unfollowed" });
      } else {
        res.status(401).send("You have not followed  this user to unfollow");
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.status(401).send("You cannot unfollow yourself");
  }
});

module.exports = router;

//$
// Acts as a placeholder to update the first element that matches the query condition.
// $[]
// Acts as a placeholder to update all elements in an array for the documents that match the query condition.
// $[<identifier>]
// Acts as a placeholder to update all elements that match the arrayFilters condition for the documents that match the query condition.
// $addToSet
// Adds elements to an array only if they do not already exist in the set.
// $pop
// Removes the first or last item of an array.
// $pull
// Removes all array elements that match a specified query.
// $push
// Adds an item to an array.
// $pullAll
// Removes all matching values from an array.
