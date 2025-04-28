const express = require('express');
const router = express.Router();
const Adjustment = require('../models/Adjustment');
const validate = require('../middleware/validate');
const schemas = require('../middleware/validationSchemas');

// Create a new adjustment
router.post('/', validate(schemas.adjustment), async (req, res, next) => {
  try {
    const result = await Adjustment.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: { ...req.body, adjustment_id: result.insertId } 
    });
  } catch (error) {
    next(error);
  }
});

// Get adjustments by contractor
router.get('/contractor/:contractorId', async (req, res, next) => {
  try {
    const adjustments = await Adjustment.getByContractor(req.params.contractorId);
    res.json({ success: true, data: adjustments });
  } catch (error) {
    next(error);
  }
});

// Get latest adjustment for a contractor
router.get('/contractor/:contractorId/latest', async (req, res, next) => {
  try {
    const adjustment = await Adjustment.getLatestAdjustments(req.params.contractorId);
    if (!adjustment) {
      return res.status(404).json({ 
        success: false, 
        error: 'No adjustments found for this contractor' 
      });
    }
    res.json({ success: true, data: adjustment });
  } catch (error) {
    next(error);
  }
});

// Get a single adjustment
router.get('/:id', async (req, res, next) => {
  try {
    const adjustment = await Adjustment.findById(req.params.id);
    if (!adjustment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Adjustment not found' 
      });
    }
    res.json({ success: true, data: adjustment });
  } catch (error) {
    next(error);
  }
});

// Update an adjustment
router.put('/:id', validate(schemas.adjustment), async (req, res, next) => {
  try {
    const result = await Adjustment.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Adjustment not found' 
      });
    }
    res.json({ 
      success: true, 
      data: { ...req.body, adjustment_id: req.params.id } 
    });
  } catch (error) {
    next(error);
  }
});

// Delete an adjustment
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Adjustment.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Adjustment not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Adjustment deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;