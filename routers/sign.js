const express = require("express");
const router = express.Router();
// const dbHandler = require("../utils/dbHandler");

router.get("/signIn", async (req, res) => {
  try {
    res.render("signIn");
  } catch (error) {
    res.status(500).render("500");
  }
  router.get("/logIn", async (req, res) => {
    try {
      res.render("logIn");
    } catch {
      res.status(500).render("500");
    }
  });
});
module.exports = router;
