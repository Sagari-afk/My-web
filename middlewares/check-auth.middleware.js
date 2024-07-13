function checkAuthStatus(req, res, next) {
  const user = req.session.user;
  if (!user) return next();
  res.locals.isAuth = true;
  res.locals.user = user;
  next();
}

module.exports = checkAuthStatus;
