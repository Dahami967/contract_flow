const express = require('express');
const router = express.Router();
const Contractor = require('../models/Contractor');
const validate = require('../middleware/validate');
const schemas = require('../middleware/validationSchemas');

// Create a new contractor
router.post('/', validate(schemas.contractor), async (req, res, next) => {
  try {
    const result = await Contractor.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: { ...req.body, contractor_id: result.insertId } 
    });
  } catch (error) {
    next(error);
  }
});

// Get all contractors
router.get('/', async (req, res, next) => {
  try {
    const contractors = await Contractor.getAll();
    res.json({ success: true, data: contractors });
  } catch (error) {
    next(error);
  }
});

// Get contractors by project
router.get('/project/:projectId', async (req, res, next) => {
  try {
    const contractors = await Contractor.getByProject(req.params.projectId);
    res.json({ success: true, data: contractors });
  } catch (error) {
    next(error);
  }
});

// Get a single contractor
router.get('/:id', async (req, res, next) => {
  try {
    const contractor = await Contractor.findById(req.params.id);
    if (!contractor) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contractor not found' 
      });
    }
    res.json({ success: true, data: contractor });
  } catch (error) {
    next(error);
  }
});

// Update a contractor
router.put('/:id', validate(schemas.contractor), async (req, res, next) => {
  try {
    const result = await Contractor.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contractor not found' 
      });
    }
    res.json({ 
      success: true, 
      data: { ...req.body, contractor_id: req.params.id } 
    });
  } catch (error) {
    next(error);
  }
});

// Delete a contractor
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Contractor.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contractor not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Contractor deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;