const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const port = process.env.PORT || 8010;
const app = express();
const bcrypt = require("bcrypt");


mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cryptoVista")
  .then(() => console.log("Mongoose Connected!", mongoose.connection.name))
  .catch(err => console.error("MongoDB connection error:", err));

const path = require("path");
const cors = require("cors");
const axios = require("axios");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const { notFoundHandler, serverErrorHandler } = require("./middleware/errorHandler");

app.use(cors());


const routes = require("./routes/index");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || "cryptoVistaSecretKey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  }
}));

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: "Invalid email" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: "Invalid password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }

))

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(express.static(path.join(__dirname, "public")));
// Cached crypto prices
let cachedPrices = null;

async function fetchPrices() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: "bitcoin,ethereum,tether,ripple,solana",
        vs_currencies: "inr",
        include_24hr_change: "true"
      },
      timeout: 10000
    }
    );
    cachedPrices = response.data;
    console.log("Crypto prices updated:", new Date().toLocaleTimeString());
  } catch (error) {
    console.error("Error fetching crypto prices:", error.message);
  }
}

// Fetch on startup, refresh every 60 seconds (CoinGecko free tier safe)
fetchPrices();
setInterval(fetchPrices, 5*60*1000);

app.locals.getCachedPrices = () => cachedPrices;
// API endpoint serves instantly from cache
app.get("/api/prices", (req, res) => {
  if (cachedPrices) {
    res.json(cachedPrices);
  } else {
    res.status(503).json({ error: "Prices loading, try again shortly" });
  }
});


app.use("/", routes);
app.use(notFoundHandler);
app.use(serverErrorHandler);


app.listen(port, () => {
  console.log(`server is starting st port ${port}`);
})
