"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/user");
const Message = require("../models/message");
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
    const lastError = req.session
        ? req.session.messages[req.session.messages.length - 1] // show form error messages for login
        : "";
    console.log(lastError);
    res.render("login_form", {
        title: "Login",
        error: lastError,
    });
});
