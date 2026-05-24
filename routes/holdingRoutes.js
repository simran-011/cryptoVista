const express = require("express");
const router = express.Router();

const { requireLogin } = require("../middleware/logger");
const Investment = require("../models/Investment");

// Holdings route
router.get("/", requireLogin, async (req, res) => {
  try {
    const cachedPrices =
      req.app.locals.getCachedPrices();

    // If prices not loaded yet
    if (!cachedPrices) {
      return res.render("holdings", {
        summary: {
          currentValue: 0,
          investedValue: 0,
          dayReturn: 0,
          dayReturnText: "N/A",
          totalReturn: 0,
          totalReturnText: "N/A",
        },

        holdings: [],
      });
    }

    // Fetch user investments
    const investments = await Investment.find({
      userId: req.user._id,
      type: "coin"
    });

    let investedValue = 0;
    let currentValue = 0;

    // Build holdings array dynamically
    const holdings = investments.map((inv) => {
      const currentPrice =
        cachedPrices[inv.coin]?.inr || 0;

      const invested =
        inv.price * inv.quantity;

      const current =
        currentPrice * inv.quantity;

      const returns = current - invested;

      const returnPercent =
        invested > 0
          ? ((returns / invested) * 100).toFixed(2)
          : "0.00";

      investedValue += invested;
      currentValue += current;

      return {
        name: inv.coin.toUpperCase(),

        shares: inv.quantity,

        avg: inv.price,

        marketPrice: currentPrice,

        change: 0,

        changeText: "N/A",

        returnValue: returns,

        returnText: `${returns >= 0 ? "+" : "-"
          }₹${Math.abs(returns).toFixed(2)}`,

        returnPercent: `${returnPercent}%`,

        currentValue: current.toFixed(2),

        investedValue: invested.toFixed(2),
      };
    });

    // Total portfolio return
    const totalReturn =
      currentValue - investedValue;

    // Render page
    res.render("holdings", {
      summary: {
        currentValue: `₹${currentValue.toFixed(2)}`,

        investedValue: `₹${investedValue.toFixed(2)}`,

        dayReturn: 0,

        dayReturnText: "N/A",

        totalReturn,

        totalReturnText: `${totalReturn >= 0 ? "+" : "-"
          }₹${Math.abs(totalReturn).toFixed(2)}`,
      },

      holdings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send("Server Error");
  }
});

module.exports = router;