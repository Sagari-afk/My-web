const User = require("../modals/user.modal");

const getAdminPanelPage = async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(401).render("401");
  }
  const users = await User.fetchAll();
  return res.render("adminPanel", { users });
};

const setUserAdmin = async (req, res) => {
  try {
    const { id, isAdmin } = req.body;
    await User.setUserAdminStatusById(id, isAdmin);
    return res.status(200).json({});
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    await User.deleteUserById(id);
    return res.status(200).json({});
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const getUserById = async (req, res) => {
  try {
    let user_id = req.params.user_id;
    const user = await User.fetchUserBy("user_id", user_id);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.fetchAll();
  return res.json(users);
};

module.exports = {
  getAdminPanelPage,
  setUserAdmin,
  deleteUser,
  getUserById,
  getAllUsers,
};
