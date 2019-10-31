var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
require("./middlewares/passport-local");
const BodyParser = require("body-parser");
const listEndpoints = require("express-list-endpoints");
var vwRoute = require("./routes/views/index");
var apiRoute = require("./routes/apis/index");
const cors = require("cors");
const userParser = require("./middlewares/parse.mdw");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// register middleware
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(passport.initialize());
app.use(userParser);

// register routes
app.use("/", vwRoute);
app.use("/api", apiRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

console.log(listEndpoints(app));

module.exports = app;
