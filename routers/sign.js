const express = require("express");
const router = express.Router();

const multer = require("multer");
const { fileFilter, storage } = require("../utils/fileUpload");
let upload = multer({ storage, fileFilter, limits: { fileSize: "10MB" } });

const signController = require("../controllers/signController");

router.get("/signIn", signController.getSignInPage);
router.get("/logIn", signController.getLogInPage);
router.get("/profile", signController.getProfile);

router.post("/signIn", signController.toSignIn);
router.post("/logIn", signController.toLogIn);
router.post("/logOut", signController.logOut);
router.post("/profile", upload.single("avatar"), signController.updateProfile);

module.exports = router;
