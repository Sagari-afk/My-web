const express = require("express");
const router = express.Router();
const dbHandler = require("../utils/dbHandler");
const crypto = require("crypto");

router.get("/signIn", async (req, res) => {
  try {
    let inputData = req.session.inputData;
    if (!inputData) {
      inputData = {
        name: "",
        surname: "",
        email: "",
      };
    }

    res.render("signIn", { inputData });
    req.session.inputData = null;
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
});
router.get("/logIn", async (req, res) => {
  try {
    res.render("logIn");
  } catch {
    console.log(error.message);
    res.status(500).render("500");
  }
});

router.post("/signIn", async (req, res) => {
  const { name, surname, email, password } = req.body;

  const inputData = {
    ...req.body,
  };

  if (password.length < 8) {
    inputData.errorMessage = "Invalid input data";
    req.session.inputData = inputData;
    req.session.save(() => {
      res.redirect("/signIn");
    });
    return;
  }

  try {
    const existingUser = await dbHandler.getUserBy("email", email);

    if (existingUser.length > 0) {
      inputData.errorMessage = "Email is used";
      req.session.inputData = inputData;
      req.session.save(() => {
        res.redirect("/signIn");
      });
      return;
    } else {
      const users = await dbHandler.getAllUsers();
      req.session.user = {
        id: users.length + 1,
        name: name,
        surname: surname,
        email: email,
      };
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hachedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  try {
    await dbHandler.createUser(name, surname, email, hachedPassword, salt);

    return res.redirect("/arts");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
});

router.post("/logIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await dbHandler.getUserBy("email", email);
    if (existingUser.length === 0) return res.redirect("signIn");
    const hachedPassword = crypto
      .pbkdf2Sync(password, existingUser[0].salt, 1000, 64, "sha512")
      .toString("hex");
    if (hachedPassword === existingUser[0].password) {
      req.session.user = {
        id: existingUser[0].user_id,
        name: existingUser[0].name,
        surname: existingUser[0].surname,
        email: existingUser[0].email,
      };
      req.session.save(() => {
        res.redirect("/arts");
      });
      return;
    }
    return res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
});

router.post("/logOut", async (req, res) => {
  req.session.user = null;
  req.session.save(() => {
    res.redirect("/");
  });
});

module.exports = router;
