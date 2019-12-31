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

    return res.json({ status: true, user });
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
    return res
      .status(422)
      .send({ errorMessage: "Must provide email and password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ errorMessage: "Email not found" });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, secretKey);
    res.send({ token });
  } catch (error) {
    return res
      .status(422)
      .send({ errorMessage: "Invalid password or email", error });
  }
});

module.exports = router;
