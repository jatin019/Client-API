const express = require('express');
const router = express.Router();

const { insertUser, getUserByEmail } = require('../model/user/User.model');
const { hashPassword, comparePassword } = require('../helpers/bcrypt.helper');
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper');
const { userAuth } = require('../middlewares/auth.middleware');

router.all('/', (req, res, next) => {
  next();
});

// Get user profile router
router.get('/', userAuth, (req, res) => {
      //this data coming from db 

      const user = {
        
        "name": "ravi",
        "company":"Company name",
        "address": "Dharuhera",
        "phone": "123456789",
        "email": "ravi999@gmail.com",
        "password": "ravi123"
  
  };

  res.json({user: req.userId});

});

// Create new user router
router.post('/', async (req, res) => {
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

    res.json({ message: 'New user created', result });
  } catch (error) {
    console.log(error);
    res.json({ message: 'error', message: error.message });
  }
});

// User sign in router
router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: 'error', message: 'Invalid form submission!' });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      console.log('Invalid credentials');
      return res.json({ status: 'error', message: 'Invalid credentials!' });
    }

    // Compare the passwords
    const isPasswordMatch = await comparePassword(password, user.password);
    console.log('Password match result:', isPasswordMatch);

    if (!isPasswordMatch) {
      console.log('Invalid credentials');
      return res.json({ status: 'error', message: 'Invalid credentials!' });
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`)
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({ status: 'success', message: 'Login successfully!', accessJWT, refreshJWT });
  } catch (error) {
    console.log('Error during login:', error);
    res.json({ status: 'error', message: error.message });
  }
});

module.exports = router;