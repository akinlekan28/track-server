const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Track = mongoose.model("Track");

const router = express.Router();
router.use(requireAuth);

router.get("/tracks", async (req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

router.post("/tracks", async (req, res) => {
  const { name, locations } = req.body;

  if (!name || !locations) {
    return res
      .status(422)
      .send({ errorMessage: "You must provide a name and locations" });
  }

  try {
    const track = new Track({ name, locations, userId: req.user._id });
    await track.save();
    res.send(track);
  } catch (error) {
    return res
      .status(422)
      .send({ errorMessage: "Error Saving track information", error });
  }
});

router.delete("/tracks/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(422).send({ message: "Track not supplied" });
  }
  try {
    const track = await Track.findOne({ _id: id });
    await track.remove();

    res.send({ status: true, message: "Track information deleted" });
  } catch (error) {
    return res
      .status(422)
      .send({ message: "Error deleting track information", error });
  }
});

module.exports = router;
