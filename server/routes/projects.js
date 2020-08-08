const express = require('express')
const router = express.Router()
const { check } = require('express-validator')

const auth = require('../middlewares/auth')
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require('../controller/projectController')

router.post(
  '/',
  auth,
  [check('name', "The project's name is required").not().isEmpty()],
  createProject
)

router.get('/', auth, getProjects)

router.put(
  '/:id',
  auth,
  [check('name', "The project's name is required").not().isEmpty()],
  updateProject
)

router.delete('/:id', auth, deleteProject)

module.exports = router
