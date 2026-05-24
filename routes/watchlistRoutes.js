const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { requireLogin } = require("../middleware/logger");

const availableCoins = [
  {
    coinId: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    marketPrice: "87.32",
    change: 0.06,
    changeText: "+₹0.06 (0.07%)",
    volume: "39,14,022",
    range: "L — H",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
  },
  {
    coinId: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    marketPrice: "430.95",
    change: 4.95,
    changeText: "+₹4.95 (1.16%)",
    volume: "89,50,772",
    range: "L — H",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
  },
  {
    coinId: "tether",
    name: "Tether",
    symbol: "USDT",
    marketPrice: "109.44",
    change: -2.45,
    changeText: "-₹2.45 (2.19%)",
    volume: "1,38,84,700",
    range: "L — H",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png"
  },
  {
    coinId: "ripple",
    name: "XRP",
    symbol: "XRP",
    marketPrice: "276.50",
    change: 0.85,
    changeText: "+₹0.85 (0.31%)",
    volume: "1,63,11,581",
    range: "L — H",
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"
  },
  {
    coinId: "solana",
    name: "Solana",
    symbol: "SOL",
    marketPrice: "152.30",
    change: 1.25,
    changeText: "+₹1.25 (0.82%)",
    volume: "72,40,000",
    range: "L — H",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
  }
];

router.get("/", requireLogin, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.redirect("/login");
    }

    const cachedPrices = req.app.locals.getCachedPrices();

    const watchlist = (user.watchlist || []).map(coin => {
      const coinObject = coin.toObject ? coin.toObject() : coin;
      const liveData = cachedPrices && cachedPrices[coinObject.coinId];

      if (!liveData) {
        return coinObject;
      }

      const price = liveData.inr;
      const change = liveData.inr_24h_change || 0;

      return {
        ...coinObject,
        marketPrice: price.toFixed(2),
        change,
        changeText: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`
      };
    });

    res.render("watchlist", {
      watchlist,
      availableCoins
    });
  } catch (err) {
    next(err);
  }
});


router.post("/add", requireLogin, async (req, res, next) => {
  try {
    const { coinId } = req.body;

    const coin = availableCoins.find(item => item.coinId === coinId);
    if (!coin) {
      return res.redirect("/watchlist");
    }

    const cachedPrices = req.app.locals.getCachedPrices();
    const liveData = cachedPrices && cachedPrices[coin.coinId];

    const coinToAdd = { ...coin };

    if (liveData) {
      const price = liveData.inr;
      const change = liveData.inr_24h_change || 0;

      coinToAdd.marketPrice = price.toFixed(2);
      coinToAdd.change = change;
      coinToAdd.changeText = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.redirect("/login");
    }

    user.watchlist = user.watchlist || [];

    const alreadyExists = user.watchlist.some(
      item => item.coinId === coin.coinId
    );

    if (!alreadyExists) {
      user.watchlist.push(coinToAdd);
      await user.save();
    }

    res.redirect("/watchlist");
  } catch (err) {
    next(err);
  }
});

router.post("/delete/:coinId", requireLogin, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.redirect("/login");
    }

    user.watchlist = (user.watchlist || []).filter(
      item => item.coinId !== req.params.coinId
    );

    await user.save();

    res.redirect("/watchlist");
  } catch (err) {
    next(err);
  }
});

module.exports = router;