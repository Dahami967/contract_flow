const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const validate = require('../middleware/validate');
const schemas = require('../middleware/validationSchemas');

// Create a new project
router.post('/', validate(schemas.project), async (req, res, next) => {
  try {
    const result = await Project.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: { ...req.body, project_id: result.insertId } 
    });
  } catch (error) {
    next(error);
  }
});

// Get all projects
router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.getAll();
    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
});

// Get a single project
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
});

// Update a project
router.put('/:id', validate(schemas.project), async (req, res, next) => {
  try {
    const result = await Project.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }
    res.json({ 
      success: true, 
      data: { ...req.body, project_id: req.params.id } 
    });
  } catch (error) {
    next(error);
  }
});

// Delete a project
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Project.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Project not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;