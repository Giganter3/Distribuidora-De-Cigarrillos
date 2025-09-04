const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

function setAuthRoutes(app) {
    router.post('/register', authController.register);
    router.post('/login', authController.login);

    app.use('/auth', router);
}

module.exports = setAuthRoutes;