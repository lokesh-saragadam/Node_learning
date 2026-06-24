const express = require('express');
const router = express.Router();

const { loginUser, registerUser } = require('../Authentication/Auth');
const { getUsers, saveUsers } = require('../Controllers/Usercontrol')
const { getProblems } = require('../Controllers/Problemcontrol');
const { stats_summary } = require('../Controllers/Statscontrol');

router.route('/users').get(getUsers).post(saveUsers);
router.route('/stats/summary').get(stats_summary);
router.route('/problems').get(getProblems);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

module.exports = {router};