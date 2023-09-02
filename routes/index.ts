import { Request, Response, NextFunction } from "express";
var express = require("express");
var router = express.Router();
const passport = require("passport");
const auth_controller = require("../controllers/auth_controller");
const index_controller = require("../controllers/index_controller");
const message_controller = require("../controllers/message_controller");
const user_controller = require("../controllers/user_controller");

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.redirect("/home");
});
router.get("/home", function (req: Request, res: Response, next: NextFunction) {
  res.render("index", { title: "Express" });
});

//Auth routes
router.post("/signup", auth_controller.sign_up_form_post);
router.post("/login", auth_controller.login_form_post);
router.get("/logout", auth_controller.logout_get);

//Index routes
router.get("/signup", index_controller.sign_up_form_get);
router.get("/login", index_controller.login_form_get);
router.get("/membership", index_controller.membership_form_get);
router.post("/membership", index_controller.membership_form_post);

//Message routes
router.get("/create-message", message_controller.new_message_form_get);
router.post("/create-message", message_controller.new_message_form_post);

module.exports = router;
