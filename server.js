const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// frontend files
app.use(express.static("public"));

// routes
app.use("/api/auth", authRoutes);

// database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/authDB")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
