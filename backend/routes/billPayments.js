const express = require('express');
const router = express.Router();
const BillPayment = require('../models/BillPayment');
const validate = require('../middleware/validate');
const schemas = require('../middleware/validationSchemas');

// Create a new bill payment
router.post('/', validate(schemas.billPayment), async (req, res, next) => {
  try {
    const result = await BillPayment.create(req.body);
    res.status(201).json({ 
      success: true, 
      data: { ...req.body, bill_payment_id: result.insertId } 
    });
  } catch (error) {
    next(error);
  }
});

// Get bill payments by contractor
router.get('/contractor/:contractorId', async (req, res, next) => {
  try {
    const payments = await BillPayment.getByContractor(req.params.contractorId);
    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
});

// Get total payments by contractor
router.get('/contractor/:contractorId/total', async (req, res, next) => {
  try {
    const total = await BillPayment.getTotalPaymentsByContractor(req.params.contractorId);
    res.json({ 
      success: true, 
      data: { total_payments: total.total_payments || 0 } 
    });
  } catch (error) {
    next(error);
  }
});

// Get a single bill payment
router.get('/:id', async (req, res, next) => {
  try {
    const payment = await BillPayment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Bill payment not found' 
      });
    }
    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
});

// Update a bill payment
router.put('/:id', validate(schemas.billPayment), async (req, res, next) => {
  try {
    const result = await BillPayment.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Bill payment not found' 
      });
    }
    res.json({ 
      success: true, 
      data: { ...req.body, bill_payment_id: req.params.id } 
    });
  } catch (error) {
    next(error);
  }
});

// Delete a bill payment
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await BillPayment.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Bill payment not found' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Bill payment deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;