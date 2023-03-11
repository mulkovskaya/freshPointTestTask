const express = require("express");
const router = express.Router();
const SalesController = require("../app/sales-controller.js");

router.route("/predict").post((req, res) => {
  let result = SalesController.predictSales(req.body);
  res.json(result);
});

module.exports = router;
