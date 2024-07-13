const dbHandler = require("../utils/dbHandler");

const getProjectsPage = async (req, res) => {
  try {
    res.render("projects");
  } catch (error) {
    res.status(500).render("500");
  }
};

module.exports = {
  getProjectsPage,
};
