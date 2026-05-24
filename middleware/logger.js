// Custom logger middleware
function requireLogin(req, res, next) {
  if (req.isAuthenticated()) return next();
  
  if (req.headers.accept && req.headers.accept.includes("application/json")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.redirect("/login");
}
function logger (req, res, next){
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // pass control to next middleware/route
};

module.exports = { requireLogin, logger };