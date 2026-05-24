const express = require("express");
const router = express.Router();
const Trader = require("../models/Trader");
const Investment = require("../models/Investment");
const { requireLogin } = require("../middleware/logger");

router.get("/", requireLogin, async (req, res, next) => {
  try {
    const traders = await Trader.find({ isActive: true }).sort({
      profit30d: -1
    });

    const copiedInvestments = await Investment.find({
      userId: req.user._id,
      type: "copy-trading",
      status: "active"
    }).populate("traderId");

    const copiedTraderIds = copiedInvestments.map(item =>
      item.traderId.toString()
    );

    res.render("copytrading", {
      traders,
      copiedTraderIds,
      copiedInvestments
    });
  } catch (err) {
    next(err);
  }
});


router.post("/copy/:traderId", requireLogin, async (req, res, next) => {
  try {
    const trader = await Trader.findById(req.params.traderId);

    if (!trader || !trader.isActive) {
      return res.redirect("/copytrading");
    }

    const existingCopy = await Investment.findOne({
      userId: req.user._id,
      traderId: trader._id,
      type: "copy-trading",
      status: "active"
    });

    if (existingCopy) {
      return res.redirect("/copytrading");
    }

    const copyAmount = Number(req.body.copyAmount);

    if (!copyAmount || copyAmount < trader.minimumCopyAmount) {
      return res.redirect("/copytrading");
    }

    const currentValue = copyAmount + (copyAmount * trader.profit30d / 100);

    await Investment.create({
      userId: req.user._id,
      type: "copy-trading",
      traderId: trader._id,
      copyAmount,
      profitPercent: trader.profit30d,
      currentValue,
      status: "active"
    });

    trader.copiedBy += 1;
    await trader.save();

    res.redirect("/copytrading");
  } catch (err) {
    next(err);
  }
});


router.post("/stop/:investmentId", requireLogin, async (req, res, next) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.investmentId,
      userId: req.user._id,
      type: "copy-trading",
      status: "active"
    });

    if (!investment) {
      return res.redirect("/copytrading");
    }

    investment.status = "stopped";
    await investment.save();

    await Trader.findByIdAndUpdate(investment.traderId, {
      $inc: { copiedBy: -1 }
    });

    res.redirect("/copytrading");
  } catch (err) {
    next(err);
  }
});

module.exports = router;