const Task = require('../models/Task')
const Project = require('../models/Project')

const { validationResult } = require('express-validator')

exports.createTask = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

  const { project } = req.body

  try {
    const projectExists = await Project.findById(project)

    if (!projectExists) return res.status(404).json({ msg: 'Project not found' })
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Invalid access' })
    }

    const task = new Task(req.body)
    await task.save()

    res.json({ task })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}

exports.getTasks = async (req, res) => {
  const { project } = req.query

  try {
    const projectExists = await Project.findById(project)

    if (!projectExists) return res.status(404).json({ msg: 'Project not found' })
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Invalid access' })
    }

    const tasks = await Task.find({ project }).sort({ createdAt: -1 })
    res.json({ tasks })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}

exports.updateTask = async (req, res) => {
  const { project, name, status } = req.body

  try {
    const projectExists = await Project.findById(project)
    const taskExists = await Task.findById(req.params.id)

    if (!taskExists) return res.status(404).json({ msg: 'Task not found' })
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Invalid access' })
    }

    const newTask = {}

    newTask.name = name
    newTask.status = status

    const task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true })

    res.json({ task })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}

exports.deleteTask = async (req, res) => {
  const { project } = req.query

  try {
    const projectExists = await Project.findById(project)
    const taskExists = await Task.findById(req.params.id)

    if (!taskExists) return res.status(404).json({ msg: 'Task not found' })
    if (projectExists.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Invalid access' })
    }

    await Task.findOneAndRemove({ _id: req.params.id })

    res.json({ msg: 'Deleted Task' })
  } catch (error) {
    console.error(error)
    res.status(500).send(`Error: ${error}`)
  }
}
