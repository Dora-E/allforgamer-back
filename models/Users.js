const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const usersSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: {
        type: String,
        enum: ["Male", "Female"]
    },
    favoris: [{
        type: Schema.Types.ObjectId,
        ref: "Game"
    }],
    avatar: {
        type: String,
        default: "https://cdn.onlinewebfonts.com/img_258083.png",
    },

    password: {
        min: 5,
        require: true,
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }


});
const UserModel = mongoose.model("User", usersSchema);
module.exports = UserModel;