const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// frontend files
app.use(express.static(path.join(__dirname, "public")));

// first page (signup)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

// routes
app.use("/api/auth", authRoutes);

// database connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authDB";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Only start server locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

module.exports = app;