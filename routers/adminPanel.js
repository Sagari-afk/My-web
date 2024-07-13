const express = require("express");
const router = express.Router();

const adminPanelController = require("../controllers/admimPanelController");

router.get("/adminPanel", adminPanelController.getAdminPanelPage);

router.post(`/adminPanel/setUserAdmin`, adminPanelController.setUserAdmin);

router.post(`/adminPanel/deleteUser`, adminPanelController.deleteUser);
router.get("/getUserById/:user_id", adminPanelController.getUserById);
router.get("/getAllUsers", adminPanelController.getAllUsers);

module.exports = router;
