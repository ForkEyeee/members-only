"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
exports.sign_up_form_get = asyncHandler(async (req, res, next) => {
    res.render("sign_up_form", {
        title: "Create an Account",
    });
});
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
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        // console.log(errors);
        // console.log(newUser);
        console.log(req.body);
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
            await newUser.save();
            res.redirect(newUser.url);
        }
    }),
];
