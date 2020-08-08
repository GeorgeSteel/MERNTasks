const Project = require('../models/Project')
const { validationResult } = require('express-validator')

exports.createProject = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  try {
    const project = new Project(req.body)
    project.author = req.user.id
    project.save()

    res.json({ project })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ author: req.user.id })
    res.json({ projects })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}

exports.updateProject = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { name } = req.body
  const newProject = {}

  if (name) newProject.name = name

  try {
    const project = await Project.findById(req.params.id)

    if (!project) return res.status(404).json({ msg: 'Project not found' })
    if (project.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Invalid access' })
    }

    const updateProject = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    )

    res.json({ updateProject })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) return res.status(404).json({ msg: 'Project not found' })
    if (project.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Invalid access' })
    }

    await Project.findOneAndRemove({ _id: req.params.id })

    res.json({ msg: 'Project Deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}
