const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')

  if (!token) return res.status(401).json({ msg: "Token don't exists, invalid access" })

  try {
    const hash = jwt.verify(token, process.env.SECRET)
    req.user = hash.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Invalid token' })
    console.error(error)
  }
}
