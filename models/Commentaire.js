const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentaireSchema = new Schema({
    message: String,
    date: Date,
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "Game"
    },

});
const CommentaireModel = mongoose.model("Commentaire", commentaireSchema);
module.exports = CommentaireModel;