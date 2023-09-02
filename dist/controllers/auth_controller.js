"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const Message = require("../models/message");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
exports.sign_up_form_post = [
    body("firstname", "Firstname must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("lastname", "Lastname must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("username", "Username must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("password", "Password must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("confirmpassword").custom((value, { req }) => {
        if (value === req.body.password) {
            return true;
        }
        else {
            throw new Error("Passwords do not match");
        }
    }),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("sign_up_form", {
                title: "Create an Account",
                errors: errors.array(),
            });
        }
        else {
            const newUser = new User({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                username: req.body.username,
                password: req.body.password,
                messages: undefined,
                membership: false,
            });
            bcrypt.hash(newUser.password, 10, async (err, hashedPassword) => {
                if (err) {
                    throw new Error("Hashing error");
                }
                newUser.password = hashedPassword;
                await newUser.save();
                req.user ? res.redirect("/home") : res.redirect("/login");
            });
        }
    }),
];
exports.login_form_post = asyncHandler(passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureMessage: true,
}), (req, res) => {
    console.log(`User has logged in ${JSON.stringify(req.user, null, 2)}`);
    req.session.user_id = req.user.id; //for instance.
    return; //old habit of mine, that even on void functions to at least use return without returning anything to clear out the Stack.
});
exports.logout_get = asyncHandler(async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/home");
    });
});
