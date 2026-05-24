const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("buyCrypto", {
    coins: [
      { name: "Bitcoin", symbol: "BTC", price: 63808 },
      { name: "Ethereum", symbol: "ETH", price: 3400 },
      { name: "Tether", symbol: "USDT", price: 1 },
      { name: "XRP", symbol: "XRP", price: 0.60 }
    ]
  });
});

module.exports = router;
