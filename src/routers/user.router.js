const express = require("express");
const router = express.Router();

const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { userAuth } = require("../middlewares/auth.middleware");
const {setPasswordResetPin, getPinByEmailPin, deletePin} = require("../model/resetPin/RestPin.model");
const { emailProcessor } = require("../helpers/email.helper");
const {resetPassReqValidation, updatePassReqValidation} = require("../middlewares/formValidation.middleware");

router.all("/", (req, res, next) => {
  next();
});

// Get user profile router
router.get("/", userAuth, (req, res, next) => {
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

router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);

    if (user && user._id) {
      const setPin = await setPasswordResetPin(email);
       result =  await emailProcessor({email, pin: setPin.pin, type:"request-new-password"});

      if (result && result.messageId) {
        return res.json({
          status: "success",
          message: "If the email exists in our database, the password reset pin will be sent shortly."
        });
      } else {
        // Log the error, but don't reveal it to the user
        console.error("Failed to send email:", result);
      }
    }

    // Always return the same message whether the user exists or not
    return res.json({
      status: "success",
      message: "If the email exists in our database, the password reset pin will be sent shortly."
    });

  } catch (error) {
    console.error("Error in reset-password:", error);
    return res.status(500).json({
      status: "error",
      message: "Unable to process your request. Please try again later."
    });
  }
});


router.patch('/reset-password', updatePassReqValidation, async (req, res) => {

  const { email, pin, newPassword } = req.body

  const getPin = await getPinByEmailPin(email, pin)

  // validate pin
  if(getPin._id){

    const dbDate = getPin.addedAt
    const expiresIn = 1

    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn) 

    const today = new Date()
    
    if(today > expDate){
      res.json({status:"error", message: "Invalid or expired pin"})

  }

  const hashedPass = await hashPassword(newPassword);

  const user = await updatePassword(email, hashedPass);

  if(user._id){

    // send email notification

    await emailProcessor({email, type:"password-update-success"});
    deletePin(email, pin)

    return res.json({status:"success", message:"Your password has been updated"})
  }
}

  res.json({status:"error", message: "Unable to update password. Please try again later."})

});

module.exports = router;
