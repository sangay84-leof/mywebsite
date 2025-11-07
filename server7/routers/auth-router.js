const express = require('express');
const router = express.Router();
const authRouter = require('../controllers/auth-controllers');

// POST /api/users/register
router.post('/register', authRouter.register);

module.exports = router;
