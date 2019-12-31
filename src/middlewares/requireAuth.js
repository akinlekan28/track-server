const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const secretKey = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({ errorMessage: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, secretKey, async (err, payload) => {
    if (err) {
      res.status(401).send({ errorMessage: "You must be logged in" });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};
