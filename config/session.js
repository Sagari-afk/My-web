const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

require("dotenv").config();

const createSessionStore = () => {
  const sessionStore = new MySQLStore({
    host: "localhost",
    port: 3306,
    database: process.env.DATABASE_SESSION_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  });
  return sessionStore;
};

const createSessionConfig = () => {
  return session({
    secret: process.env.SESSION_SECRET,
    store: createSessionStore(),
    resave: false,
    saveUninitialized: false,
  });
};

module.exports = createSessionConfig;
