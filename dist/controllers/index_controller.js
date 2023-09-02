"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const Message = require("../models/message");
const Password = require("../models/password");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
exports.sign_up_form_get = asyncHandler(async (req, res, next) => {
    res.render("sign_up_form", {
        title: "Create an Account",
    });
});
exports.login_form_get = asyncHandler(async (req, res, next) => {
    const lastError = req.session.messages
        ? req.session.messages[req.session.messages.length - 1] // show form error messages for login
        : "";
    res.render("login_form", {
        title: "Login",
        error: lastError,
    });
});
exports.membership_form_get = asyncHandler(async (req, res, next) => {
    res.render("membership_form", {
        title: "Become a member",
    });
});
exports.membership_form_post = asyncHandler(async (req, res, next) => {
    const getUser = req.user;
    const membershipPassword = await Password.find({}, { password: 1, _id: 0 }).exec();
    console.log(membershipPassword[0].password);
    if (membershipPassword[0].password === req.body.secretpassword) {
        await User.findOneAndUpdate({ _id: getUser._id }, { membership: true });
    }
    res.redirect("/home");
});
