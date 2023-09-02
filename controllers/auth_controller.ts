import { Request, Response, NextFunction } from "express";
const User = require("../models/user");
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
    } else {
      throw new Error("Passwords do not match");
    }
  }),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      res.render("sign_up_form", {
        title: "Create an Account",
        errors: errors.array(),
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.username,
      });
    } else {
      const newUser = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.username,
        password: req.body.password,
        messages: undefined,
        membership: false,
        admin: req.body.admin === "on" ? true : false,
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
          req.user ? res.redirect("/home") : res.redirect("/login");
        }
      );
    }
  }),
];

exports.login_form_post = asyncHandler(
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

exports.logout_post = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    req.logout(function (err: string) {
      if (err) {
        return next(err);
      }
      res.redirect("/home");
    });
  }
);
