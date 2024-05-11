const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

require("dotenv").config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const options = {
  host: "localhost",
  port: 3306,
  database: process.env.DATABASE_SESSION_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
const artsRouts = require("./routers/arts");
const projectsRouts = require("./routers/projects");
const signRouters = require("./routers/sign");

app.use((req, res, next) => {
  const user = req.session.user;
  if (!user) return next();
  res.locals.isAuth = true;
  res.locals.user = user;
  next();
});

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
