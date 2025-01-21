const express = require("express");
const router = express.Router();
const prisma = require("../db");

// GET /tracks - get all tracks
router.get("/", async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (error) {
    next(error);
  }
});

// GET /tracks/:id - get specific track
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const track = await prisma.track.findUnique({
      where: { id: parseInt(id) },
    });

    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    res.json(track);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
