const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.authUser = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ msg: "The user doesn't exists" })

    const correctPass = await bcrypt.compare(password, user.password)

    if (!correctPass) return res.status(400).json({ msg: 'Incorrect password' })

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
    res.status(400).json({ msg: `Error: ${error}` })
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ msg: `Error: ${error}` })
  }
}
