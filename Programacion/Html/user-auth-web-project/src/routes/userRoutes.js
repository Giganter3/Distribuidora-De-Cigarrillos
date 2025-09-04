const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

const setUserRoutes = (app) => {
    router.get('/profile', userController.getUserProfile);
    router.put('/profile', userController.updateUserProfile);

    app.use('/api/users', router);
};

module.exports = setUserRoutes;