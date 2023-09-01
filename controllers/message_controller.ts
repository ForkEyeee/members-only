import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
const Message = require("../models/message");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

const asyncHandler = require("express-async-handler");

exports.sign_up_form_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render("sign_up_form", {
      title: "Create an Account",
    });
  }
);

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
    } else {
      throw new Error("Passwords do not match");
    }
  }),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    // console.log(errors);
    // console.log(newUser);
    console.log(req.body);
    if (!errors.isEmpty()) {
      res.render("sign_up_form", {
        title: "Create an Account",
        errors: errors.array(),
      });
    } else {
      const newUser = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        messages: undefined,
        membership: false,
      });
      bcrypt.hash(
        newUser.password,
        10,
        async (err: object, hashedPassword: string) => {
          if (err) {
            throw new Error("Hashing error");
          }
          newUser.password = hashedPassword;
          await newUser.save();
          res.redirect(newUser.url);
        }
      );
    }
  }),
];

exports.new_member_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render("new_member_form", {
      title: "Gain Membership",
    });
  }
);

exports.login_form_get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.render("login_form", {
      title: "Login",
    });
  }
);

exports.login_form_post = asyncHandler(
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
