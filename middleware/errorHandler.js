const path = require("path");

function notFoundHandler(req, res, next) {
  res.status(404).render("404");
}

function serverErrorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("500");
}

module.exports = { notFoundHandler, serverErrorHandler };