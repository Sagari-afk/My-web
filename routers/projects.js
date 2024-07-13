const express = require("express");
const router = express.Router();

const projectsController = require("../controllers/projectsController");

router.get("/projects", projectsController.getProjectsPage);
module.exports = router;
