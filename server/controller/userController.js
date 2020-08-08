const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body

  try {
    const userExists = await User.findOne({ email })

    if (userExists) return res.status(400).json({ msg: 'The user already exists' })

    const user = new User(req.body)

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)

    await user.save()

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (error, token) => {
      if (error) throw error

      return res.json({ token })
    })
  } catch (error) {
    console.error(error)
    res.status(400).send(`Error: ${error}`)
  }
}
