const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const { createUser } = require('../controller/userController')

router.post(
  '/',
  [
    check('name', 'The name is required').not().isEmpty(),
    check('email', 'Write a valid email').isEmail(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
  ],
  createUser
)

module.exports = router
