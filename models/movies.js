const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moviesSchema = new Schema(
  {
    name: String,
    genre: String,
    image: String,
    category: String,
    year: String,
  },
  { collection: "Movies" }
);
const Movie = mongoose.model("Movies", moviesSchema);
module.exports = Movie;
