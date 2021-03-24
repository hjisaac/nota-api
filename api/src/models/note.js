const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
    {
        content: {  
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        favoriteCount: {
            type: Number,
            default: 0
        },
        favoritedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    // for having createdAt and updatedAt with Date type
    { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;