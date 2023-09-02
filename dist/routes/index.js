"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
const auth_controller = require("../controllers/auth_controller");
const index_controller = require("../controllers/index_controller");
const message_controller = require("../controllers/message_controller");
/* GET home page. */
router.get("/", function (req, res, next) {
    res.redirect("/home");
});
router.get("/home", message_controller.message_list);
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
router.get("/delete/:id", message_controller.message_delete_get);
router.post("/delete/:id", message_controller.message_delete_post);
module.exports = router;
