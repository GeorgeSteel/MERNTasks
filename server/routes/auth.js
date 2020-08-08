const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const auth = require('../middlewares/auth')
const { authUser, getUser } = require('../controller/authController')

router.post('/', [check('email', 'Write a valid email').isEmail()], authUser)

router.get('/', auth, getUser)

module.exports = router
