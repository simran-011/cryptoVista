const express = require("express");
const path = require("path");

const router = express.Router();
const Investment = require("../models/Investment");


const { requireLogin } = require("../middleware/logger");




router.post("/", requireLogin, async (req, res) => {
  try {
    const cachedPrices = req.app.locals.getCachedPrices();

    if (!cachedPrices) {
      return res.status(503).json({ error: "Prices not available yet" });
    }

    const { coin, quantity } = req.body;

    if (!coin) {
      return res.status(400).json({ error: "Coin missing" });
    }
    const coinId = coin.toLowerCase();
    if (!cachedPrices[coinId]) {
      return res.status(400).json({ error: "Invalid coin" });
    }

    const price = cachedPrices[coinId].inr;
    const qty = Number(quantity);

    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const totalCost = price * qty;

    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("AUTH:", req.isAuthenticated());

    const investment = new Investment({
      userId: req.user._id,
      coin: coinId,
      quantity: qty,
      price
    });

    await investment.save();

    return res.json({ message: "Purchase successful", totalCost });

  } catch (err) {
    console.error("Buy route error:", err);
    return res.status(500).json({ error: "Purchase failed" });
  }
});

module.exports = router;

