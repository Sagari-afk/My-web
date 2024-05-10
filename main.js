const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

const artsRouts = require("./routers/arts");
const projectsRouts = require("./routers/projects");
const signRouters = require("./routers/sign");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

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

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((error, req, res, next) => {
  res.status(500).render("500");
  console.log(error);
});

app.listen(3000);
