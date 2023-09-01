var express = require("express");
var router = express.Router();

const message_controller = require("../controllers/message_controller");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/signup-form", message_controller.sign_up_form_get);

router.post("/signup-form", message_controller.sign_up_form_post);

module.exports = router;
