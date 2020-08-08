const express = require('express')
const cors = require('cors')
const DBconnect = require('./config/db')

const app = express()
const port = process.env.PORT || 4000

DBconnect()

app.use(cors())
app.use(express.json({ extended: true }))

app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/projects', require('./routes/projects'))
app.use('/api/tasks', require('./routes/tasks'))

app.listen(port, () => console.log(`Server running on port: ${port}`))
