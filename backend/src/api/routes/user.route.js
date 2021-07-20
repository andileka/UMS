const express = require("express");
const controller = require("../controllers/user.controller");

const router = express.Router();

router.param("userId", controller.load);
router.route("/").get(controller.list);
router.route("/create").post(controller.create);
router.route("/addGrupToUser").post(controller.addGrupToUser);
router.route("/removeGrupFromUser").post(controller.removeGrupFromUser);

router
  .route("/getEdditableGrupsForUser/:userId")
  .get(controller.getEdditableGrupsForUser);
router
  .route("/:userId")
  .get(controller.get)
  .patch(controller.update)
  .delete(controller.remove);

module.exports = router;
