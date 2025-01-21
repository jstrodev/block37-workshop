const express = require("express");
const router = express.Router();
const prisma = require("../db");

// GET /playlists - get all playlists
router.get("/", async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

// POST /playlists - create a new playlist
router.post("/", async (req, res, next) => {
  try {
    const { name, description, ownerId, trackIds } = req.body;

    // Create playlist with owner and connect tracks
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        owner: {
          connect: { id: parseInt(ownerId) },
        },
        tracks: {
          connect: trackIds.map((id) => ({ id: parseInt(id) })),
        },
      },
      include: {
        tracks: true,
        owner: true,
      },
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
});

// GET /playlists/:id - get specific playlist with tracks
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const playlist = await prisma.playlist.findUnique({
      where: { id: parseInt(id) },
      include: {
        tracks: true,
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
