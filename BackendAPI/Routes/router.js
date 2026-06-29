const express = require('express');
const router = express.Router();

const { loginUser, registerUser } = require('../Authentication/Auth');
const { getUsers } = require('../Controllers/Usercontrol')
const { getProblems , postUserData } = require('../Controllers/Problemcontrol');
const { stats_summary } = require('../Controllers/Statscontrol');

router.route('/users/:id').get(getUsers)
router.route('/stats/summary').get(stats_summary);
router.route('/problems').get(getProblems).post( postUserData );;
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = { router };