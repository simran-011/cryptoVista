const express = require("express");
const router = express.Router();
router.post("/", (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.redirect("/login");
    });
})
module.exports = router;