const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    logout,
    verifyEmail,
    forgetPassword,
    resetPassword,
    checkAuth
} = require('../controllers/auth.controller');

const verifyToken = require('../middleware/verifyToken');

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);


router.get("/check-auth", verifyToken, checkAuth)


module.exports = router;
