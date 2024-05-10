const express = require("express");
const router = express.Router();
// const dbHandler = require("../utils/dbHandler");

router.get("/projects", async (req, res) => {
  try {
    res.render("projects");
  } catch (error) {
    res.status(500).render("500");
  }
});
module.exports = router;
