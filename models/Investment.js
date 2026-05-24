const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["coin", "copy-trading"],
    default: "coin"
  },

  coin: {
    type: String,
    required: function () {
      return this.type === "coin";
    }
  },

  quantity: {
    type: Number,
    required: function () {
      return this.type === "coin";
    }
  },

  price: {
    type: Number,
    required: function () {
      return this.type === "coin";
    }
  },

  traderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trader",
    required: function () {
      return this.type === "copy-trading";
    }
  },

  copyAmount: {
    type: Number,
    required: function () {
      return this.type === "copy-trading";
    }
  },

  profitPercent: {
    type: Number,
    default: 0
  },

  currentValue: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["active", "stopped"],
    default: "active"
  },

  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Investment", investmentSchema);