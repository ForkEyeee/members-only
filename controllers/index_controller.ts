require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
const Password = require("../models/password");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.sign_up_form_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render("sign_up_form", {
      title: "Create an Account",
    });
  }
);

exports.login_form_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const lastError = req.session.messages
      ? req.session.messages[req.session.messages.length - 1] // show form error messages for login
      : "";
    res.render("login_form", {
      title: "Login",
      error: lastError,
    });
  }
);

exports.membership_form_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(process.env.dev_db_url);

    res.render("membership_form", {
      title: "Become a member",
    });
  }
);
exports.membership_form_post = [
  body("secretpassword").custom(async (value: any, { req }: any) => {
    const secretPassword = process.env.MONGODB_URI
      ? process.env.PASSWORD
      : (await Password.findOne({}, { password: 1, _id: 0 }).exec()).password;
    if (secretPassword === req.body.secretpassword) {
      return true;
    } else {
      throw new Error("Wrong secret password");
    }
  }),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("membership_form", {
        title: "Become a member",
        errors: errors.array(),
      });
    } else {
      const getUser = req.user;
      await User.findOneAndUpdate({ _id: getUser._id }, { membership: true });
      res.redirect("/membership");
    }
  }),
];
