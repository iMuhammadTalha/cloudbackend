const {getAllUsers, createUser, deleteUser, updateUser} = require('./controller');
const validation = require('../user/validations');
const router = require('express').Router();
const path = require('path');



router.use('/auth', require(path.join(__dirname, '/auth/routes.js')));


module.exports = router;