const User = require("../modals/user.modal");
const crypto = require("crypto");

const getSignInPage = async (req, res) => {
  try {
    let inputData = req.session.inputData;
    if (!inputData) {
      inputData = {
        name: "",
        surname: "",
        email: "",
        avatar: "",
      };
    }

    res.render("signIn", { inputData });
    req.session.inputData = null;
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const getLogInPage = async (req, res) => {
  try {
    res.render("logIn");
  } catch {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const toSignIn = async (req, res) => {
  const { name, surname, email, password } = req.body;

  const inputData = {
    ...req.body,
  };

  if (password.length < 8) {
    inputData.errorMessage = "Invalid input data";
    req.session.inputData = inputData;
    req.session.save(() => {
      res.redirect("/signIn");
    });
    return;
  }

  try {
    const existingUser = await User.fetchUserBy("email", email);

    if (existingUser.length > 0) {
      inputData.errorMessage = "Email is used";
      req.session.inputData = inputData;
      req.session.save(() => {
        res.redirect("/signIn");
      });
      return;
    } else {
      const users = await User.fetchAll();
      req.session.user = {
        id: users.length + 1,
        name: name,
        surname: surname,
        email: email,
        avatar: "/assets/profile-none-img.png",
        isAdmin: false,
      };
    }
    console.log(req.session.user);
  } catch (error) {
    console.log(error);
    res.status(500).render("500");
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hachedPassword = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  try {
    const user = new User({ name, surname, email, hachedPassword, salt });
    await user.save();

    return res.redirect("/arts");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const toLogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.fetchUserBy("email", email);
    if (existingUser.length === 0) return res.redirect("signIn");
    const hachedPassword = crypto
      .pbkdf2Sync(password, existingUser[0].salt, 1000, 64, "sha512")
      .toString("hex");
    if (hachedPassword === existingUser[0].password) {
      req.session.user = {
        id: existingUser[0].user_id,
        name: existingUser[0].name,
        surname: existingUser[0].surname,
        email: existingUser[0].email,
        avatar: existingUser[0].user_img_url,
        isAdmin: existingUser[0].isAdmin,
      };
      req.session.save(() => {
        res.redirect("/arts");
      });
      return;
    }
    return res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const logOut = async (req, res) => {
  req.session.user = null;
  req.session.save(() => {
    res.redirect("/");
  });
};

const getProfile = async (req, res) => {
  try {
    res.render("profile", { user: res.locals.user });
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

const updateProfile = async (req, res) => {
  const { name, surname, email, password } = req.body;
  console.log(name, surname, email, password);

  try {
    const existingUser = await User.fetchUserBy("email", email);

    let imageLocation = "";
    if (req.file.path) {
      imageLocation = req.file.path.substring(req.file.path.indexOf("\\") + 1);
    } else {
      imageLocation = existingUser[0].user_img_url;
    }

    const hachedPassword = crypto
      .pbkdf2Sync(password, existingUser[0].salt, 1000, 64, "sha512")
      .toString("hex");
    console.log(existingUser[0].password);
    console.log(hachedPassword);
    if (existingUser[0].password !== hachedPassword) {
      console.log("nespravne heslo");
      res.redirect("/profile");
      return;
    }
    req.session.user = {
      id: existingUser[0].user_id,
      name: name,
      surname: surname,
      email: email,
      avatar: imageLocation,
      isAdmin: existingUser[0].isAdmin,
    };
    console.log(req.session.user);
    await User.updateUser(req.session.user);
    req.session.save(() => {
      res.redirect("/profile");
    });
    return;
  } catch (error) {
    console.log(error.message);
    res.status(500).render("500");
  }
};

module.exports = {
  getSignInPage,
  getLogInPage,
  toSignIn,
  toLogIn,
  logOut,
  getProfile,
  updateProfile,
};
