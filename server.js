require("dotenv").config();

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
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.log("MONGO_URI is missing");
} else {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
}


// Only start server locally
if (process.env.NODE_ENV !== "production") {

  app.listen(5000, () => {

    console.log("Server running on port 5000");

  });

}


module.exports = app;