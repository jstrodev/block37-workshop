const express = require("express");

// Import routers
const usersRouter = require("./routes/users");
const playlistsRouter = require("./routes/playlists");
const tracksRouter = require("./routes/tracks");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/users", usersRouter);
app.use("/playlists", playlistsRouter);
app.use("/tracks", tracksRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = { app };
