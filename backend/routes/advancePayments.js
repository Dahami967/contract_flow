const express = require('express');
const router = express.Router();
const AdvancePayment = require('../models/AdvancePayment');
const validate = require('../middleware/validate');
const schemas = require('../middleware/validationSchemas');

// Create a new advance payment
router.post('/', validate(schemas.advancePayment), async (req, res, next) => {
  try {
    const result = await AdvancePayment.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: { ...req.body, advance_payment_id: result.insertId } 
    });
  } catch (error) {
    next(error);
  }
});

// Get advance payments by contractor
router.get('/contractor/:contractorId', async (req, res, next) => {
  try {
    const payments = await AdvancePayment.getByContractor(req.params.contractorId);
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
});

// Get a single advance payment
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await AdvancePayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Advance payment not found' 
      });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
});

// Update an advance payment
router.put('/:id', validate(schemas.advancePayment), async (req, res, next) => {
  try {
    const result = await AdvancePayment.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Advance payment not found' 
      });
    }
    res.json({ 
      success: true, 
      data: { ...req.body, advance_payment_id: req.params.id } 
    });
  } catch (error) {
    next(error);
  }
});

// Delete an advance payment
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await AdvancePayment.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Advance payment not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Advance payment deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;