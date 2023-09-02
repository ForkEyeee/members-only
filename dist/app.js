"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const compression = require("compression");
const helmet = require("helmet");
var indexRouter = require("./routes/index");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
// Compress all routes
app.use(helmet.contentSecurityPolicy({
    directives: {
        "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
}));
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2000,
});
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
}));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
app.use(express.urlencoded({ extended: false }));
app.use(limiter);
app.use(compression());
app.use(logger("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.currentUser = req.user !== undefined ? req.user : {}; //locals
    console.log(path.join(__dirname, "../public"));
    next();
});
app.use("/", indexRouter);
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
// Set up mongoose connection
const mongoDB = process.env.MONGODB_URI || process.env.dev_db_url;
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
