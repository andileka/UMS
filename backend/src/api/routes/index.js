const express = require("express");
const userRoutes = require("./user.route");
const grupRoutes = require("./grup.route");

const router = express.Router();

router.use("/grups", grupRoutes);
router.use("/users", userRoutes);

module.exports = router;
