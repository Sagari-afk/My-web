const backError = (error, req, res, next) => {
  res.status(500).render("500");
  console.log(error);
};

module.exports = backError;
