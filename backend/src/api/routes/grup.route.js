const express = require("express");
const { validate } = require("express-validation");
const controller = require("../controllers/grup.controller");

const router = express.Router();

router.param("grupId", controller.load);
router.route("/").get(controller.list);
router.route("/create").post(controller.create);
router.route("/addUserToGrup").post(controller.addUserToGrup);
router.route("/removeUserFromGrup").post(controller.removeUserFromGrup);

router
  .route("/getEdditableUsersForGrup/:grupId")
  .get(controller.getEdditableUsersForGrup);

router
  .route("/:grupId")
  .get(controller.get)
  .patch(controller.update)
  .delete(controller.remove);

router.route("/me").patch(controller.updateMe);

module.exports = router;
