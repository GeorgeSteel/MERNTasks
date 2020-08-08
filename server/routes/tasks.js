const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const auth = require('../middlewares/auth')
const { createTask, getTasks, updateTask, deleteTask } = require('../controller/taskController')

router.post(
  '/',
  auth,
  [check('name', "The task's name is required, please write it").not().isEmpty()],
  createTask
)
router.get('/', auth, getTasks)
router.put('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)

module.exports = router
