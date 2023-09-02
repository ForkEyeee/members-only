"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const User = require("../models/user");
const Password = require("../models/password");
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
    console.log(process.env.dev_db_url);
    res.render("membership_form", {
        title: "Become a member",
    });
});
exports.membership_form_post = [
    body("secretpassword").custom(async (value, { req }) => {
        const secretPassword = process.env.MONGODB_URI
            ? process.env.PASSWORD
            : (await Password.findOne({}, { password: 1, _id: 0 }).exec()).password;
        if (secretPassword === req.body.secretpassword) {
            return true;
        }
        else {
            throw new Error("Wrong secret password");
        }
    }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("membership_form", {
                title: "Become a member",
                errors: errors.array(),
            });
        }
        else {
            const getUser = req.user;
            await User.findOneAndUpdate({ _id: getUser._id }, { membership: true });
            res.redirect("/membership");
        }
    }),
];
