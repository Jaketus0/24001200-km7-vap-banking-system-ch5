

const express = require('express');
const router = express.Router();
const AuthControllers = require('../controllers/authControllers');
const restrict = require('../middleware/restrict'); // Uncomment jika menggunakan restrict middleware

router.post("/register", AuthControllers.handleRegister);

router.post("/login", AuthControllers.handleLogin);

router.get("/authenticate",restrict, AuthControllers.handleAuthenticate);

module.exports = router;
