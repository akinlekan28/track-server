const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const router = express.Router();

const User = mongoose.model("User");

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, secretKey);

    return res.json({ status: true, token, userId: user._id });
  } catch (err) {
    return res.status(422).json({
      status: false,
      message: "Error saving user details",
      errorMessage: err.message
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ message: "Must provide email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "Email not found" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.send({ token, userId: user._id });
  } catch (error) {
    return res
      .status(422)
      .send({ message: "Invalid password or email", error });
  }
});

router.get("/profile/:userId", async (req, res) => {
  let { userId } = req.params;

  try {
    const userProfile = await User.findOne({ _id: userId });
    if (!userProfile) {
      res.status(404).send({ message: "Error fetching user profile" });
    }
    let user = {
      name: userProfile.name,
      email: userProfile.email,
      date_registered: userProfile.date_registered
    };

    return res.json(user);
  } catch (error) {
    return res
      .status(422)
      .send({ message: "There was an error processing your request", error });
  }
});

module.exports = router;
