const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    idUser: { type: Schema.Types.ObjectId, ref: "Users" },
    idMovie: { type: Schema.Types.ObjectId, ref: "Movies" },
    score: Number,
  },
  { collection: "Favorites" }
);
const Favorite = mongoose.model("Favorites", favoriteSchema);
module.exports = Favorite;
