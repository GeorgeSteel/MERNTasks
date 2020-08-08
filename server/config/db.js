const mongoose = require('mongoose')
require('dotenv').config({ path: 'variables.env' })

const DBconnect = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    console.log('DB connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = DBconnect
