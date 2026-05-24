const express = require("express");
const path = require("path");
const { requireLogin } = require("../middleware/logger");
const router = express.Router();
const Investment = require("../models/Investment");


// Explore route
router.get("/", requireLogin, async (req, res) => {
  const cachedPrices = req.app.locals.getCachedPrices();
  if (!cachedPrices) {
    return res.render("explore", { investments: { total: "Loading...", invested: "Loading...", totalReturn: 0, totalReturnText: "N/A", dayReturn: 0, dayReturnText: "N/A" }, coins: [], news: [], trading: [] });
  }
  const investments = await Investment.find({
    userId: req.user._id,
    type: "coin"
  });

  let invested = 0;
  let currentValue = 0;

  investments.forEach(inv => {
    const liveData = cachedPrices[inv.coin];

    if (!liveData) {
      return;
    }

    invested += inv.price * inv.quantity;
    currentValue += liveData.inr * inv.quantity;
  });

  const totalReturn = currentValue - invested;

  res.render("explore", {
    coins: [
      {
        name: "Bitcoin",
        symbol: "BTC",
        price: "$63,808",
        change: 1.27,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        price: "$3,200",
        change: 0.82,
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
      }
    ],

    news: [
      {
        title: "Bitcoin rises after ETF demand",
        desc: "Institutional investors continue accumulating BTC.",
        time: "35 minutes ago"
      }
    ],

    investments: {
      total: `₹${currentValue.toFixed(2)}`,
      invested: `₹${invested.toFixed(2)}`,
      totalReturn,
      totalReturnText: `${totalReturn >= 0 ? "+" : "-"}₹${Math.abs(totalReturn).toFixed(2)}`,
      dayReturn: 0,
      dayReturnText: "N/A"
    },

    trading: [
      { type: "Bullish", text: "Resistance breakouts" },
      { type: "Bullish", text: "MACD above signal line" },
      { type: "Bearish", text: "RSI overbought" }
    ]
  });
});

module.exports = router;
