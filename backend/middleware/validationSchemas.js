const Joi = require('joi');

const schemas = {
  project: Joi.object({
    project_no: Joi.string().required(),
    project_description: Joi.string().required(),
    district: Joi.string().required(),
    ds_division: Joi.string().required(),
    fund_source: Joi.string().required(),
    vote_details: Joi.string().required(),
    total_cost_estimate: Joi.number().min(0).precision(2).required(),
    beneficiaries: Joi.number().integer().min(0).required(),
    output: Joi.string().required(),
    outcome: Joi.string().required(),
    feasibility_studies: Joi.string().required(),
    relevant_pc: Joi.string().required()
  }),

  contractor: Joi.object({
    project_id: Joi.number().required(),
    contractor_name: Joi.string().required(),
    contract_no: Joi.string().required(),
    contract_amount: Joi.number().min(0).precision(2).required(),
    date_awarded: Joi.date().required(),
    vat_details: Joi.string().required(),
    contract_period: Joi.string().required(),
    performance_bond_bank: Joi.string().required(),
    performance_bond_amount: Joi.number().min(0).precision(2).required(),
    performance_bond_expiry: Joi.date().required()
  }),

  advancePayment: Joi.object({
    contractor_id: Joi.number().required(),
    date_of_payment: Joi.date().required(),
    amount_paid: Joi.number().min(0).precision(2).required(),
    advance_bond_bank: Joi.string().required(),
    advance_bond_amount: Joi.number().min(0).precision(2).required(),
    advance_bond_expiry: Joi.date().required()
  }),

  billPayment: Joi.object({
    contractor_id: Joi.number().required(),
    date_of_payment: Joi.date().required(),
    bill_no: Joi.string().required(),
    bill_amount: Joi.number().min(0).precision(2).required(),
    recovery_advance: Joi.number().min(0).precision(2).default(0),
    recovery_liquidity_damages: Joi.number().min(0).precision(2).default(0),
    recovery_others: Joi.number().min(0).precision(2).default(0),
    recovery_retention: Joi.number().min(0).precision(2).default(0),
    net_payment: Joi.number().min(0).precision(2).required()
  }),

  adjustment: Joi.object({
    contractor_id: Joi.number().required(),
    contract_extension_date: Joi.date().allow(null),
    contract_extension_details: Joi.string().allow(null),
    advance_bond_extension_date: Joi.date().allow(null),
    advance_bond_extension_details: Joi.string().allow(null),
    performance_bond_extension_date: Joi.date().allow(null),
    performance_bond_extension_details: Joi.string().allow(null),
    variation_date: Joi.date().allow(null),
    variation_amount: Joi.number().min(0).precision(2).allow(null),
    variation_percentage: Joi.number().min(0).max(100).precision(2).allow(null),
    notes: Joi.string().allow(null)
  })
};

module.exports = schemas;