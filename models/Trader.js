const mongoose = require("mongoose");

const traderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    avatar: {
        type: String,
        default: ""
    },

    profit30d: {
        type: Number,
        required: true
    },

    followers: {
        type: Number,
        default: 0
    },

    riskLevel: {
        type: String,
        enum: ["Low", "Medium", "High"],
        required: true
    },

    favoriteCoins: [String],

    strategy: {
        type: String,
        required: true
    },

    minimumCopyAmount: {
        type: Number,
        default: 1000
    },

    winRate: {
        type: Number,
        default: 0
    },

    totalTrades: {
        type: Number,
        default: 0
    },

    copiedBy: {
        type: Number,
        default: 0
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Trader", traderSchema);