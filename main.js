const express = require("express");
const path = require("path");
const app = express();

const artsRouts = require("./routers/arts");
const projectsRouts = require("./routers/projects");
const signRouters = require("./routers/sign");
const adminPanel = require("./routers/adminPanel");

const checkAuthStatus = require("./middlewares/check-auth.middleware");
const errorNotFound = require("./middlewares/error-not-found.middleware");
const errorOnBack = require("./middlewares/error-back.middleware");
const createSessionConfig = require("./config/session");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(createSessionConfig());
app.use(checkAuthStatus);

app.get("/", (req, res) => {
  try {
    res.render("main");
  } catch (error) {
    res.status(500).render("500");
  }
});
app.use("/", artsRouts);
app.use("/", projectsRouts);
app.use("/", signRouters);
app.use("/", adminPanel);

app.use(errorNotFound);
app.use(errorOnBack);

app.listen(3000);
