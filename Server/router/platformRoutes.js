const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  console.log("es");
  res.json({ Endpoint: "jwt" });
});

module.exports = router;
