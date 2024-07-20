const express = require("express");
const router = express.Router();

const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { userAuth } = require("../middlewares/auth.middleware");
const {setPasswordResetPin} = require("../model/resetPin/RestPin.model");

router.all("/", (req, res, next) => {
  next();
});

// Get user profile router
router.get("/", userAuth, (req, res) => {
  // The user object is now available in req.user
  const { _id, name, company, address, phone, email, refreshJWT, password } =
    req.user;

  res.json({
    user: {
      refreshJWT: {
        token: refreshJWT.token,
        addedAt: refreshJWT.addedAt,
      },
      _id,
      name,
      company,
      address,
      phone,
      email,
      password,
    },
  });
});
// Create new user router
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;

  try {
    // Hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({ message: "New user created", result });
  } catch (error) {
    console.log(error);
    res.json({ message: "error", message: error.message });
  }
});

// User sign in router
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form submission!" });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log("Invalid credentials");
      return res.json({ status: "error", message: "Invalid credentials!" });
    }

    // Compare the passwords
    const isPasswordMatch = await comparePassword(password, user.password);
    console.log("Password match result:", isPasswordMatch);

    if (!isPasswordMatch) {
      console.log("Invalid credentials");
      return res.json({ status: "error", message: "Invalid credentials!" });
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({
      status: "success",
      message: "Login successfully!",
      accessJWT,
      refreshJWT,
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.json({ status: "error", message: error.message });
  }
});

// A. Create and send password reset pin number
//  1. receive email
//  2. check if user exist for the email
//  3. create unique 6 digit pin
//  4. save pin and email in database
//  5. email the pin

// B. Update password in database
//  1. receive email, pin and new password
//  2. validate pin
//  3. encrypt new password
//  4. update password in database
//  5. send email notification

// C. Server side form validation
//  1. create middleware to validate from data

router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);

  if (user && user._id) {

    // create //2. check if user exist for the email
    const setPin = await setPasswordResetPin(email)
    res.json(setPin)
  }
  // res.json({
  //   status: "error",
  //   message:
  //     "If the email is exist in our database, the password reset pin will be sent shortly.",
  // });
});

module.exports = router;
