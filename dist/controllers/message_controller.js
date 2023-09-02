"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const Message = require("../models/message");
const Password = require("../models/password");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
exports.new_message_form_get = asyncHandler(async (req, res, next) => {
    res.render("new_message_form", {
        title: "Create a message",
    });
});
exports.new_message_form_post = [
    body("message", "Name must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler(async (req, res, next) => {
        console.log("hey");
        const errors = validationResult(req);
        const message = new Message({
            title: req.body.title,
            timestamp: new Date(),
            text: req.body.message,
        });
        if (!errors.isEmpty()) {
            res.render("new_message_form", {
                title: "Create a Message",
                message: message,
                errors: errors.array(),
            });
        }
        else {
            const newMessage = new Message({
                title: req.body.title,
                timestamp: new Date(),
                text: req.body.message,
            });
            // const findUser = await User.find({ username: req.user.username }).exec();
            await User.findOneAndUpdate({ username: req.user.username }, { $push: { messages: newMessage } });
            console.log(req.user);
            await newMessage.save();
            // res.redirect(newMessage.url);
            res.redirect("/");
        }
    }),
];
