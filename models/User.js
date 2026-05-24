const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.isNew;
        },
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
    },

    watchlist: [
        {
            coinId: String,
            name: String,
            symbol: String,
            image: String,
            marketPrice: String,
            change: Number,
            changeText: String,
            volume: String,
            range: String
        }
    ]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;