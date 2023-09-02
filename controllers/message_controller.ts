import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
const Message = require("../models/message");
const Password = require("../models/password");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.message_list = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Message.find({});
    // console.log(res.locals.currentUser);
    // console.log(JSON.stringify(res.locals.currentUser) === "{}");
    console.log(messages[0].url);
    res.render("index", {
      title: "Messages",
      message_list: messages,
    });
  }
);

exports.new_message_form_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render("new_message_form", {
      title: "Create a message",
    });
  }
);

exports.new_message_form_post = [
  body("message", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
    } else {
      const newMessage = new Message({
        title: req.body.title,
        timestamp: new Date(),
        text: req.body.message,
      });
      // const findUser = await User.find({ username: req.user.username }).exec();
      await User.findOneAndUpdate(
        { username: req.user.username },
        { $push: { messages: newMessage } }
      );

      console.log(req.user);

      await newMessage.save();
      // res.redirect(newMessage.url);
      res.redirect("/");
    }
  }),
];

exports.message_delete_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const message = await Message.findOne({ _id: req.params.id });
    res.render("message_delete", {
      title: "Delete message",
      message: message,
    });
  }
);

exports.message_delete_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await Message.deleteOne({ _id: req.params.id }).exec();
    res.redirect("/home");
  }
);
