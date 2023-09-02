import { Request, Response, NextFunction } from "express";
import { ClientSession } from "mongodb";
const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.message_list = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const messages = await Message.find({});
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
      timestamp: new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/"),
      text: req.body.message,
      fullname: req.user.first_name + req.user.last_name,
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
        timestamp: new Date()
          .toJSON()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/"),
        text: req.body.message,
        fullname: req.user.first_name + " " + req.user.last_name,
      });
      await newMessage.save();
      await User.findOneAndUpdate(
        { username: req.user.username },
        { $push: { messages: newMessage } }
      );
      res.redirect("/home");
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
