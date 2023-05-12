const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");
const express = require("express");
const app = express();
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
require("dotenv").config();

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;