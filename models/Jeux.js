const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    name: String,
    creator: String,
    date: {
        type: Date,
        default: null,
    },
    description: String,
    video: [{
        type: String
    }],
    images: [{
        type: String,
        default: "https://cdn.onlinewebfonts.com/img_258083.png"
    }],
    categories: String
});
const GameModel = mongoose.model("Game", gameSchema);
module.exports = GameModel;