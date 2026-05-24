const mongoose = require("mongoose");
const Trader = require("./models/Trader");

mongoose.connect("mongodb://127.0.0.1:27017/cryptoVista")
    .then(() => console.log("MongoDB connected for trader seeding"))
    .catch(err => console.error("MongoDB connection error:", err));

const traders = [
    {
        name: "CryptoKing",
        username: "cryptoking",
        avatar: "",
        profit30d: 28.5,
        followers: 12450,
        riskLevel: "Medium",
        favoriteCoins: ["BTC", "ETH"],
        strategy: "Focuses on strong large-cap crypto with steady monthly growth.",
        minimumCopyAmount: 1000,
        winRate: 72,
        totalTrades: 148,
        copiedBy: 0,
        isActive: true
    },
    {
        name: "ETHMaster",
        username: "ethmaster",
        avatar: "",
        profit30d: 18.2,
        followers: 8320,
        riskLevel: "Low",
        favoriteCoins: ["ETH", "BTC"],
        strategy: "Uses safer Ethereum-focused trades with lower volatility.",
        minimumCopyAmount: 800,
        winRate: 81,
        totalTrades: 96,
        copiedBy: 0,
        isActive: true
    },
    {
        name: "SolanaPro",
        username: "solanapro",
        avatar: "",
        profit30d: 35.7,
        followers: 15890,
        riskLevel: "High",
        favoriteCoins: ["SOL", "BTC"],
        strategy: "Targets fast-moving coins with higher risk and higher return potential.",
        minimumCopyAmount: 1500,
        winRate: 64,
        totalTrades: 212,
        copiedBy: 0,
        isActive: true
    }
];

async function seedTraders() {
    try {
        await Trader.deleteMany({});
        await Trader.insertMany(traders);

        console.log("Demo traders added successfully");
    } catch (err) {
        console.error("Error seeding traders:", err);
    } finally {
        await mongoose.connection.close();
    }
}

seedTraders();
